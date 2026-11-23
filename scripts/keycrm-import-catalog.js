// Імпорт каталогу WaterHub у KeyCRM: група «Водопідготовка» → підгрупи за категоріями → товари.
// Ціни-заглушки: закупівельна 100, РРЦ 200 (далі правляться вручну в KeyCRM).
// Повторний запуск безпечний: наявні групи й товари з тим самим SKU пропускаються.
//
//   KEYCRM_API_KEY=... node scripts/keycrm-import-catalog.js            # попередній перегляд
//   KEYCRM_API_KEY=... node scripts/keycrm-import-catalog.js --apply    # створити
import { keycrm } from '../lib/keycrm.js';
import { CATALOG } from '../lib/catalog.js';

const APPLY = process.argv.includes('--apply');
const ROOT = 'Водопідготовка';
const PURCHASED_PRICE = 100;
const PRICE = 200;
export const SUBGROUPS = {
  column: 'Балони',
  valve: 'Керуючі клапани',
  tank: 'Сольові баки',
  media: 'Фільтруючі матеріали',
  salt: 'Сіль таблетована',
  chem: 'Хімія для сервісу',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastWrite = 0;
async function write(path, body) {
  const wait = 1100 - (Date.now() - lastWrite); // ліміт KeyCRM ~60 запитів/хв
  if (wait > 0) await sleep(wait);
  lastWrite = Date.now();
  return keycrm.call(path, { method: 'POST', body });
}

async function listAll(path) {
  const out = [];
  for (let page = 1; page < 200; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const res = await keycrm.call(`${path}${sep}limit=50&page=${page}`);
    const rows = res.data || [];
    out.push(...rows);
    if (rows.length < 50) break;
    await sleep(300);
  }
  return out;
}

const norm = (s) => String(s || '').trim().toLowerCase();

const categories = await listAll('/products/categories');
let root = categories.find((c) => norm(c.name) === norm(ROOT) && !c.parent_id);
console.log(`Групи в KeyCRM: ${categories.length}. «${ROOT}»: ${root ? `є (id ${root.id})` : 'буде створено'}`);
if (!root && APPLY) root = await write('/products/categories', { name: ROOT });

const subIds = {};
for (const [cat, name] of Object.entries(SUBGROUPS)) {
  if (!CATALOG.some((p) => p.cat === cat)) continue;
  let sub = root && categories.find((c) => norm(c.name) === norm(name) && c.parent_id === root.id);
  console.log(`  ${name}: ${sub ? `є (id ${sub.id})` : 'буде створено'}`);
  if (!sub && APPLY) sub = await write('/products/categories', { name, parent_id: root.id });
  if (sub) subIds[cat] = sub.id;
}

const products = await listAll('/products');
const existing = new Set(products.map((p) => norm(p.sku)).filter(Boolean));
const todo = CATALOG.filter((p) => !existing.has(norm(p.sku)));
console.log(`\nТовари: ${CATALOG.length} у каталозі, ${CATALOG.length - todo.length} вже в KeyCRM, створити ${todo.length}.`);

let ok = 0; const failed = [];
for (const p of todo) {
  const body = {
    name: p.name,
    sku: p.sku,
    price: PRICE,
    purchased_price: PURCHASED_PRICE,
    currency_code: 'UAH',
    unit_type: p.unit,
    category_id: subIds[p.cat],
  };
  if (!APPLY) { console.log(`  [перегляд] ${SUBGROUPS[p.cat]} / ${p.sku} — ${p.name}`); continue; }
  try {
    const r = await write('/products', body);
    ok++;
    console.log(`  ✓ ${p.sku} (id ${r.id})`);
  } catch (e) {
    failed.push(p.sku);
    console.log(`  ✗ ${p.sku}: ${e.message}${e.details ? ' ' + JSON.stringify(e.details) : ''}`);
    if (ok === 0 && failed.length === 1) { console.log('Перша спроба невдала — зупиняюсь, щоб не плодити помилки.'); break; }
  }
}
console.log(APPLY ? `\nСтворено ${ok}, помилок ${failed.length}${failed.length ? ': ' + failed.join(', ') : ''}` : '\nЦе попередній перегляд. Запустіть з --apply, щоб створити.');
