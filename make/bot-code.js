// ЗГЕНЕРОВАНО make/build.js — не редагувати вручну, правити lib/* та make/handler.js
// Каталог WaterHub — перенесено з Sheet «WaterHub — довідник: колони, клапани, засипки».
// price — ціна-орієнтир ринку, грн (для діапазону береться верхня межа); null — ціну треба уточнити.
// vol — об'єм фасування засипки в літрах (для розрахунку кількості мішків).

const CATALOG = [
  // Колони (корпус FRP)
  { sku: 'WH-COL-0817', cat: 'column', name: 'Колона 0817', unit: 'шт', price: null },
  { sku: 'WH-COL-1017', cat: 'column', name: 'Колона 1017', unit: 'шт', price: null },
  { sku: 'WH-COL-1035', cat: 'column', name: 'Колона 1035', unit: 'шт', price: null },
  { sku: 'WH-COL-1054', cat: 'column', name: 'Колона 1054', unit: 'шт', price: null },
  { sku: 'WH-COL-1252', cat: 'column', name: 'Колона 1252', unit: 'шт', price: null },
  { sku: 'WH-COL-1354', cat: 'column', name: 'Колона 1354', unit: 'шт', price: null },
  { sku: 'WH-COL-1465', cat: 'column', name: 'Колона 1465', unit: 'шт', price: null },

  // Клапани
  { sku: 'WH-VLV-CLACK-CI', cat: 'valve', name: "Клапан Clack WS1 CI — пом'якшення, за лічильником", unit: 'шт', price: null },
  { sku: 'WH-VLV-RX-F63C3', cat: 'valve', name: "Клапан Runxin F63C3 — пом'якшення, за лічильником", unit: 'шт', price: 7800 },
  { sku: 'WH-VLV-CLACK-TC', cat: 'valve', name: 'Клапан Clack WS1 TC (Total Care) — безреагентне знезалізнення', unit: 'шт', price: null },
  { sku: 'WH-VLV-RX-F67C1', cat: 'valve', name: 'Клапан Runxin F67C1 — фільтрація (промивка)', unit: 'шт', price: 7800 },

  // Сольові баки
  { sku: 'WH-BT-070', cat: 'tank', name: 'Сольовий бак 70 л у зборі', unit: 'шт', price: 2999 },
  { sku: 'WH-BT-100', cat: 'tank', name: 'Сольовий бак 100 л у зборі', unit: 'шт', price: 4994 },
  { sku: 'WH-BT-150', cat: 'tank', name: 'Сольовий бак 150 л у зборі', unit: 'шт', price: null },

  // Засипки — CTraiding
  { sku: 'WH-MED-CT-CTF-12', cat: 'media', name: 'CTFilter, комплексна засипка, 12 л', unit: 'мішок', price: 6270, vol: 12 },
  { sku: 'WH-MED-CT-CTF-25', cat: 'media', name: 'CTFilter, комплексна засипка, 25 л', unit: 'мішок', price: 9845, vol: 25 },
  { sku: 'WH-MED-CT-CTF2', cat: 'media', name: 'CTFilter 2, багатокомпонентна засипка', unit: 'мішок', price: 5722, vol: null },
  { sku: 'WH-MED-CT-AIRPLUS-15', cat: 'media', name: 'CTFilter AirPlus, комплексна засипка, 15 л', unit: 'мішок', price: 4540, vol: 15 },
  { sku: 'WH-MED-CT-KATALOX-30', cat: 'media', name: 'Katalox Light, 30 кг', unit: 'мішок', price: 6600, vol: 28.3 },
  { sku: 'WH-MED-CT-PRC107-25', cat: 'media', name: "Purolex PRC107, іонообмінна смола, 25 л", unit: 'мішок', price: 5062, vol: 25 },
  { sku: 'WH-MED-CT-PRC108E-25', cat: 'media', name: "Purolex PRC108E, іонообмінна смола, 25 л", unit: 'мішок', price: null, vol: 25 },
  { sku: 'WH-MED-CT-ULTRAMIX-25', cat: 'media', name: 'Purolex UltraMix, комплексна засипка, 25 л', unit: 'мішок', price: 10125, vol: 25 },
  { sku: 'WH-MED-CT-ULTRAMIXP-25', cat: 'media', name: 'Purolex UltraMix+, комплексна засипка, 25 л', unit: 'мішок', price: 11025, vol: 25 },

  // Засипки — Filtrons
  { sku: 'WH-MED-FL-X1-12', cat: 'media', name: 'Filtrons X1, комплексна засипка, 12 л', unit: 'мішок', price: 4928, vol: 12 },
  { sku: 'WH-MED-FL-X1-25', cat: 'media', name: 'Filtrons X1, комплексна засипка, 25 л', unit: 'мішок', price: 10268, vol: 25 },
  { sku: 'WH-MED-FL-X2-12', cat: 'media', name: 'Filtrons X2, комплексна засипка, 12 л', unit: 'мішок', price: 4710, vol: 12 },
  { sku: 'WH-MED-FL-X2-25', cat: 'media', name: 'Filtrons X2, комплексна засипка, 25 л', unit: 'мішок', price: 9812, vol: 25 },
  { sku: 'WH-MED-FL-X3-15', cat: 'media', name: 'Filtrons X3, комплексна засипка, 15 л', unit: 'мішок', price: 4646, vol: 15 },
  { sku: 'WH-MED-FL-X5-12', cat: 'media', name: 'Filtrons X5, засипка, 12 л (FLR-X5-12)', unit: 'мішок', price: 5049, vol: 12 },
  { sku: 'WH-MED-FL-X5-25B', cat: 'media', name: 'Filtrons X5, засипка, 25 л (мішок)', unit: 'мішок', price: 10615, vol: 25 },
  { sku: 'WH-MED-FL-X5-25V', cat: 'media', name: 'Filtrons X5, засипка, 25 л (відро)', unit: 'відро', price: 10721, vol: 25 },
  { sku: 'WH-MED-FL-XULTRA-25', cat: 'media', name: 'Filtrons X Ultra, мультикомпонентна засипка, 25 л', unit: 'мішок', price: null, vol: 25 },
  { sku: 'WH-MED-FL-XAIR-15', cat: 'media', name: 'Filtrons XaiR, засипка для безреагентного знезалізнення, 15 л', unit: 'мішок', price: 4378, vol: 15 },
  { sku: 'WH-MED-FL-ION-25', cat: 'media', name: 'Filtrons Ion Exchange Resin, іонообмінна смола, 25 л', unit: 'мішок', price: 4561, vol: 25 },

  // Засипки — Raifil
  { sku: 'WH-MED-RF-C100E-25', cat: 'media', name: 'Raifil C100E 2.0, іонообмінна смола, 25 л', unit: 'мішок', price: 5430, vol: 25 },
  { sku: 'WH-MED-RF-C100E-1', cat: 'media', name: 'Raifil C100E 2.0, іонообмінна смола, 1 л', unit: 'л', price: 193, vol: 1 },
  { sku: 'WH-MED-RF-NR1-25', cat: 'media', name: 'Raifil Resinex NR-1, аніонообмінна смола, 25 л', unit: 'мішок', price: null, vol: 25 },
  { sku: 'WH-MED-RF-MULTI-12', cat: 'media', name: 'Raifil Multi Cleaner, багатофункціональна засипка, 12 л', unit: 'мішок', price: 5450, vol: 12 },
  { sku: 'WH-MED-RF-MULTI-25', cat: 'media', name: 'Raifil Multi Cleaner, багатофункціональна засипка, 25 л', unit: 'мішок', price: 11340, vol: 25 },
  { sku: 'WH-MED-RF-BIRM-28', cat: 'media', name: 'Raifil Birm, 28,3 л', unit: 'мішок', price: 4515, vol: 28.3 },
  { sku: 'WH-MED-RF-GSP', cat: 'media', name: 'Raifil Greensand Plus', unit: 'мішок', price: null, vol: null },
  { sku: 'WH-MED-RF-GACPLUS', cat: 'media', name: 'Raifil GAC Plus, каталітичне активоване вугілля', unit: 'мішок', price: 11200, vol: null },
  { sku: 'WH-MED-RF-FAG-28', cat: 'media', name: 'Raifil Filter AG, 28,3 л', unit: 'мішок', price: null, vol: 28.3 },
  { sku: 'WH-MED-RF-TURBIDEX', cat: 'media', name: 'Raifil Turbidex (Filter AG+)', unit: 'мішок', price: 1980, vol: null },
  { sku: 'WH-MED-RF-A1000-25', cat: 'media', name: "Raifil Jacobi AquaSorb A-1000, вугілля кам'яне, 25 кг", unit: 'мішок', price: null, vol: 50 },
  { sku: 'WH-MED-RF-A1000-1', cat: 'media', name: "Raifil Jacobi AquaSorb A-1000, вугілля кам'яне, 1 кг (2 л)", unit: 'шт', price: null, vol: 2 },
  { sku: 'WH-MED-RF-CS-25', cat: 'media', name: 'Raifil Jacobi AquaSorb CS, вугілля кокосове, 25 кг', unit: 'мішок', price: null, vol: 50 },
  { sku: 'WH-MED-RF-CC-25', cat: 'media', name: 'Raifil Jacobi AquaSorb CC, активоване вугілля, 25 кг', unit: 'мішок', price: null, vol: 50 },
  { sku: 'WH-CHEM-RF-RESCLEAN-5', cat: 'chem', name: 'Raifil Resin Cleaner, очищувач смоли, 5 л', unit: 'каністра', price: 1080 },

  // Засипки — Ecosoft
  { sku: 'WH-MED-ECO-ECOMIXA-12', cat: 'media', name: 'Ecosoft Ecomix A, 12 л', unit: 'мішок', price: 5508, vol: 12 },
  { sku: 'WH-MED-ECO-ECOMIXA-25', cat: 'media', name: 'Ecosoft Ecomix A, 25 л', unit: 'мішок', price: 11725, vol: 25 },
  { sku: 'WH-MED-ECO-ECOMIXC-12', cat: 'media', name: 'Ecosoft Ecomix C, 12 л', unit: 'мішок', price: 6000, vol: 12 },
  { sku: 'WH-MED-ECO-ECOMIXC-25', cat: 'media', name: 'Ecosoft Ecomix C, 25 л', unit: 'мішок', price: 12775, vol: 25 },
  { sku: 'WH-MED-ECO-ECOMIXP-12', cat: 'media', name: 'Ecosoft Ecomix P, 12 л', unit: 'мішок', price: 3049, vol: 12 },
  { sku: 'WH-MED-ECO-ESOFT-25', cat: 'media', name: 'Ecosoft Ecolite Soft, смола, 25 л', unit: 'мішок', price: 3500, vol: 25 },
  { sku: 'WH-MED-ECO-EUSOFT-25', cat: 'media', name: 'Ecosoft Ecolite Ultrasoft, смола, 25 л', unit: 'мішок', price: 5175, vol: 25 },
  { sku: 'WH-MED-ECO-EDEMIN-25', cat: 'media', name: 'Ecosoft Ecolite Demin, смола, 25 л', unit: 'мішок', price: 9675, vol: 25 },
  { sku: 'WH-MED-ECO-CARB830-25', cat: 'media', name: 'Ecosoft Ecocarb 8×30, вугілля, 25 кг', unit: 'мішок', price: 5175, vol: 50 },
  { sku: 'WH-MED-ECO-CARB1230-25', cat: 'media', name: 'Ecosoft Ecocarb 12×30, вугілля, 25 кг', unit: 'мішок', price: null, vol: 50 },
  { sku: 'WH-MED-ECO-CO-5', cat: 'media', name: 'Ecosoft CO5, сорбент кольоровості, 5 л', unit: 'шт', price: 5130, vol: 5 },
  { sku: 'WH-MED-ECO-CO-12', cat: 'media', name: 'Ecosoft CO12, сорбент кольоровості, 12 л', unit: 'мішок', price: 12312, vol: 12 },
  { sku: 'WH-MED-ECO-QUARTZ-25', cat: 'media', name: 'Ecosoft кварцовий пісок 2–4 мм, 25 кг', unit: 'мішок', price: 400, vol: 16 },

  // Сіль
  { sku: 'WH-SALT-FL-EXTRA-25', cat: 'salt', name: 'Сіль таблетована Filtrons EXTRA, 25 кг', unit: 'мішок', price: 725 },
  { sku: 'WH-SALT-ECO-ECOSIL-25', cat: 'salt', name: 'Сіль таблетована Ecosoft Ecosil, 25 кг', unit: 'мішок', price: 788 },
  { sku: 'WH-SALT-ECO-STD-25', cat: 'salt', name: 'Сіль таблетована Ecosoft Standard, 25 кг', unit: 'мішок', price: 625 },
];

const BY_SKU = Object.fromEntries(CATALOG.map((p) => [p.sku, p]));

function item(sku) {
  const p = BY_SKU[sku];
  if (!p) throw new Error(`SKU ${sku} відсутній у каталозі`);
  return p;
}

// Підбір системи водопідготовки за аналізом води та споживанням.
// Логіка детермінована: однакові вхідні дані → однакова специфікація.


// Колони: fill — об'єм засипки для іонообмінних/комплексних засипок (л),
// soft — пікова витрата для пом'якшення/комплексної засипки (м³/год),
// filt — пікова витрата для фільтрів з промивкою (знезалізнення, вугілля, механіка).
const COLUMNS = [
  { size: '0817', sku: 'WH-COL-0817', fill: 7.5, soft: 0.6, filt: 0.4, tank: 'WH-BT-070', gravel: 0 },
  { size: '1017', sku: 'WH-COL-1017', fill: 12, soft: 0.8, filt: 0.5, tank: 'WH-BT-070', gravel: 0 },
  { size: '1035', sku: 'WH-COL-1035', fill: 25, soft: 1.2, filt: 0.8, tank: 'WH-BT-070', gravel: 1 },
  { size: '1054', sku: 'WH-COL-1054', fill: 40, soft: 1.6, filt: 1.1, tank: 'WH-BT-070', gravel: 1 },
  { size: '1252', sku: 'WH-COL-1252', fill: 50, soft: 2.0, filt: 1.4, tank: 'WH-BT-100', gravel: 1 },
  { size: '1354', sku: 'WH-COL-1354', fill: 62, soft: 2.4, filt: 1.7, tank: 'WH-BT-100', gravel: 2 },
  { size: '1465', sku: 'WH-COL-1465', fill: 85, soft: 3.0, filt: 2.1, tank: 'WH-BT-150', gravel: 2 },
];

// Пороги (ДСанПіН 2.2.4-171-10 + комфортна жорсткість для побуту).
const LIMITS = {
  fe: 0.3, mn: 0.1, hardness: 3.5, nitrates: 50, ammonium: 0.5,
  oxidability: 5, turbidity: 2, color: 20, phMin: 6.5, phMax: 8.5,
};

const DAILY_L_PER_PERSON = 200;     // л/добу на людину
const REGEN_DAYS_TARGET = 4;        // мінімум днів між регенераціями
const CAPACITY = { resin: 1100, complex: 700, nitrate: 600 }; // мг-екв на 1 л засипки

// Кількість мішків засипки з промивкою: округлення вгору з допуском 15% недосипу.
const bags = (volume, bagVol) => Math.max(1, Math.ceil(volume / bagVol - 0.15));

const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

function normalizeInput(raw = {}) {
  const people = num(raw.people) ?? 3;
  const baths = num(raw.baths) ?? 1;
  return {
    source: raw.source === 'central' ? 'central' : 'well',
    segment: raw.segment === 'premium' ? 'premium' : 'mass',
    fe: num(raw.fe) ?? 0,
    mn: num(raw.mn) ?? 0,
    hardness: num(raw.hardness) ?? 0,
    ph: num(raw.ph),
    oxidability: num(raw.oxidability) ?? 0,
    ammonium: num(raw.ammonium) ?? 0,
    nitrates: num(raw.nitrates) ?? 0,
    turbidity: num(raw.turbidity) ?? 0,
    color: num(raw.color) ?? 0,
    h2s: raw.h2s === true || raw.h2s === 'true' || raw.h2s === 1 || raw.h2s === '1',
    chlorine: raw.chlorine === undefined ? raw.source === 'central'
      : raw.chlorine === true || raw.chlorine === 'true' || raw.chlorine === '1',
    people,
    baths,
    flow: num(raw.flow), // ручне значення пікової витрати, м³/год
  };
}

function peakFlow(p) {
  if (p.flow) return p.flow;
  const byBaths = p.baths <= 1 ? 1.0 : p.baths === 2 ? 1.5 : p.baths === 3 ? 2.0 : 2.5 + 0.5 * (p.baths - 4);
  const byPeople = 0.5 + 0.25 * p.people;
  return Math.round(Math.max(byBaths, byPeople) * 10) / 10;
}

function pickColumn({ flow, kind, minFill = 0 }) {
  const key = kind === 'filt' ? 'filt' : 'soft';
  const ok = COLUMNS.find((c) => c[key] >= flow && c.fill >= minFill);
  return { col: ok || COLUMNS[COLUMNS.length - 1], undersized: !ok };
}

// Підбір фасувань під потрібний об'єм: великі мішки + добір меншими, обираємо дешевший варіант.
function packsFor(volume, skus) {
  const packs = skus.map(item).sort((a, b) => b.vol - a.vol);
  const big = packs[0];
  let n = Math.floor(volume / big.vol);
  let rem = Math.round((volume - n * big.vol) * 10) / 10;
  if (rem <= 0.05 * big.vol) return n > 0 ? [{ sku: big.sku, qty: n }] : [{ sku: big.sku, qty: 1 }];
  const small = packs[1];
  if (small) {
    const k = Math.ceil(rem / small.vol);
    const costSmall = (small.price ?? Infinity) * k;
    const costBig = big.price ?? Infinity;
    // дрібні фасування (1–2 л) — лише для невеликого добору, не більше 5 шт
    const tooMany = small.vol < 5 && k > 5;
    if (!tooMany && k * small.vol < big.vol && (costSmall < costBig || (big.price == null && small.price == null))) {
      const res = [];
      if (n > 0) res.push({ sku: big.sku, qty: n });
      res.push({ sku: small.sku, qty: k });
      return res;
    }
  }
  return [{ sku: big.sku, qty: n + 1 }];
}

function saltValve(seg) { return seg === 'premium' ? 'WH-VLV-CLACK-CI' : 'WH-VLV-RX-F63C3'; }
function filterValve(seg) { return seg === 'premium' ? 'WH-VLV-CLACK-CI' : 'WH-VLV-RX-F67C1'; }

function stage({ key, title, why, col, valve, media, salt, gravel = true, notes = [] }) {
  const lines = [{ sku: col.sku, qty: 1 }, { sku: valve, qty: 1 }, ...media];
  if (gravel && col.gravel) lines.push({ sku: 'WH-MED-ECO-QUARTZ-25', qty: col.gravel });
  if (salt) {
    lines.push({ sku: col.tank, qty: 1 });
    lines.push({ sku: 'WH-SALT-ECO-STD-25', qty: 2 });
  }
  return { key, title, why, column: col.size, lines, notes };
}

function selectSystem(raw) {
  const p = normalizeInput(raw);
  const flow = peakFlow(p);
  const dailyL = p.people * DAILY_L_PER_PERSON;
  const warnings = [];
  const stages = [];

  const has = {
    iron: p.fe > LIMITS.fe,
    mn: p.mn > LIMITS.mn,
    hard: p.hardness > LIMITS.hardness,
    nitr: p.nitrates > LIMITS.nitrates,
    amm: p.ammonium > LIMITS.ammonium,
    org: p.oxidability > LIMITS.oxidability,
    turb: p.turbidity > LIMITS.turbidity,
    color: p.color > LIMITS.color,
    h2s: p.h2s,
    chlorine: p.source === 'central' && p.chlorine,
  };
  const heavyIron = p.fe > 5 || p.mn > 1 || p.h2s;

  // 1. Механіка / каламутність
  if (has.turb) {
    const { col } = pickColumn({ flow, kind: 'filt' });
    stages.push(stage({
      key: 'turbidity', title: 'Освітлення (каламутність)',
      why: `Каламутність ${p.turbidity} NTU > ${LIMITS.turbidity}`,
      col, valve: filterValve(p.segment),
      media: [{ sku: 'WH-MED-RF-FAG-28', qty: bags(col.fill * 0.65, 28.3) }],
    }));
  }

  // 2. Вугілля для міської води (хлор, запах, органіка)
  if (has.chlorine) {
    const { col } = pickColumn({ flow, kind: 'filt' });
    stages.push(stage({
      key: 'carbon', title: 'Сорбційний фільтр (хлор, запах)',
      why: 'Централізоване водопостачання: видалення хлору та запаху, захист смоли',
      col, valve: filterValve(p.segment),
      media: [{ sku: 'WH-MED-ECO-CARB830-25', qty: Math.max(1, Math.ceil((col.fill * 0.65) / 50)) }],
    }));
  }

  // 3. Знезалізнення (окрема ступінь при важкому залізі / H2S або коли інших проблем немає)
  const softTask = has.hard || has.amm || has.org;
  const ironStage = (has.iron || has.mn || has.h2s) && (heavyIron || !softTask);
  if (ironStage) {
    const { col, undersized } = pickColumn({ flow, kind: 'filt' });
    if (undersized) warnings.push(`Пікова витрата ${flow} м³/год перевищує можливості однієї колони знезалізнення 1465 — розглянути дві паралельні колони.`);
    const needAir = p.segment === 'premium' || p.fe > 3 || p.h2s || p.mn > 0.5;
    const valve = needAir ? 'WH-VLV-CLACK-TC' : 'WH-VLV-RX-F67C1';
    const vol = col.fill * 0.65;
    const media = p.segment === 'premium'
      ? [{ sku: 'WH-MED-FL-XAIR-15', qty: bags(vol, 15) }]
      : [{ sku: 'WH-MED-CT-KATALOX-30', qty: bags(vol, 28.3) }];
    const why = [
      has.iron && `Fe ${p.fe} мг/л`, has.mn && `Mn ${p.mn} мг/л`, has.h2s && 'сірководень',
    ].filter(Boolean).join(', ');
    const notes = [];
    if (needAir && p.segment !== 'premium') notes.push('Clack TC обрано через високе Fe/Mn/H₂S: потрібна повітряна подушка.');
    if (p.ph !== null && p.ph < 6.8 && p.segment !== 'premium') notes.push(`Katalox Light працює від pH 5,8; при pH ${p.ph} — контроль якості після запуску.`);
    stages.push(stage({ key: 'iron', title: 'Безреагентне знезалізнення', why, col, valve, media, notes }));
  }

  // 4. Пом'якшення / комплексна засипка
  if (softTask || ((has.iron || has.mn) && !ironStage)) {
    const useComplex = has.amm || has.org || ((has.iron || has.mn) && !ironStage);
    const kind = useComplex ? 'complex' : 'resin';
    // для комплексної засипки враховуємо Fe як навантаження (умовно 1 мг/л Fe ≈ 0,5 мг-екв/л)
    const load = (p.hardness + (useComplex && !ironStage ? p.fe * 0.5 : 0)) * dailyL; // мг-екв/добу
    const minFill = (load * REGEN_DAYS_TARGET) / CAPACITY[kind];
    const { col, undersized } = pickColumn({ flow: useComplex ? flow / 0.85 : flow, kind: 'soft', minFill });
    if (undersized) warnings.push(`Навантаження велике: навіть колона 1465 регенеруватиметься частіше ніж раз на ${REGEN_DAYS_TARGET} дні — розглянути дуплекс-систему.`);
    let media; let title;
    if (useComplex) {
      const heavyOrg = p.oxidability > 10;
      media = heavyOrg
        ? packsFor(col.fill, ['WH-MED-ECO-ECOMIXC-25', 'WH-MED-ECO-ECOMIXC-12'])
        : packsFor(col.fill, ['WH-MED-CT-CTF-25', 'WH-MED-CT-CTF-12']);
      title = 'Комплексне очищення (Fe, Mn, жорсткість, амоній, органіка)';
      if (p.fe > 10 || p.mn > 2) warnings.push('Fe > 10 або Mn > 2 мг/л — поза межами комплексної засипки, потрібна консультація технолога.');
    } else {
      media = packsFor(col.fill, ['WH-MED-RF-C100E-25', 'WH-MED-RF-C100E-1']);
      title = "Пом'якшення";
    }
    const why = [
      has.hard && `жорсткість ${p.hardness} мг-екв/л`, has.amm && `амоній ${p.ammonium} мг/л`,
      has.org && `окиснюваність ${p.oxidability} мгO₂/л`,
      !ironStage && has.iron && `Fe ${p.fe} мг/л`, !ironStage && has.mn && `Mn ${p.mn} мг/л`,
    ].filter(Boolean).join(', ');
    const regenDays = Math.round(((col.fill * CAPACITY[kind]) / Math.max(load, 1)) * 10) / 10;
    const notes = load > 0 ? [`Орієнтовна регенерація: раз на ~${Math.min(regenDays, 14)} діб (за ${p.people} мешк.).`] : [];
    stages.push(stage({ key: useComplex ? 'complex' : 'softener', title, why, col, valve: saltValve(p.segment), media, salt: true, notes }));
  }

  // 5. Нітрати
  if (has.nitr) {
    const load = (p.nitrates / 62) * dailyL; // мг-екв/добу
    const minFill = (load * REGEN_DAYS_TARGET) / CAPACITY.nitrate;
    const { col } = pickColumn({ flow, kind: 'soft', minFill });
    stages.push(stage({
      key: 'nitrates', title: 'Видалення нітратів',
      why: `Нітрати ${p.nitrates} мг/л > ${LIMITS.nitrates}`,
      col, valve: saltValve(p.segment),
      media: [{ sku: 'WH-MED-RF-NR1-25', qty: Math.max(1, Math.ceil(col.fill / 25)) }], salt: true,
    }));
  }

  // 6. Кольоровість
  if (has.color) {
    const { col } = pickColumn({ flow, kind: 'filt' });
    stages.push(stage({
      key: 'color', title: 'Видалення кольоровості',
      why: `Кольоровість ${p.color}° > ${LIMITS.color}°`,
      col, valve: saltValve(p.segment),
      media: [{ sku: 'WH-MED-ECO-CO-12', qty: Math.max(1, Math.ceil((col.fill * 0.7) / 12)) }], salt: true,
    }));
  }

  if (p.ph !== null && p.ph < LIMITS.phMin) warnings.push(`pH ${p.ph} < ${LIMITS.phMin}: потрібна корекція pH (засипки немає в каталозі — уточнити з постачальником).`);
  if (p.ph !== null && p.ph > 9) warnings.push(`pH ${p.ph} > 9: засипки знезалізнення працюють гірше — консультація технолога.`);
  if (!stages.length) warnings.push('Показники в межах норм — основна система не потрібна, достатньо механічного фільтра.');

  // Згортання специфікації
  const agg = new Map();
  for (const s of stages) for (const l of s.lines) agg.set(l.sku, (agg.get(l.sku) || 0) + l.qty);
  const lines = [...agg].map(([sku, qty]) => {
    const it = item(sku);
    return { sku, name: it.name, unit: it.unit, qty, price: it.price, sum: it.price == null ? null : it.price * qty };
  });
  const total = lines.reduce((s, l) => s + (l.sum || 0), 0);
  const missingPrices = lines.filter((l) => l.price == null).map((l) => l.sku);
  if (missingPrices.length) warnings.push(`Немає ціни в каталозі для ${missingPrices.length} поз. — уточніть ціну.`);

  return { input: p, flow, dailyM3: dailyL / 1000, stages, lines, total, missingPrices, warnings };
}

// Розбір вільного тексту менеджера: «Свердловина, Fe 2.5, Mn 0.3, жорсткість 9, pH 7, 4 людини, 2 санвузли.
// Клієнт: Іван Петренко, +380671234567, Буча»

const N = '(\\d+(?:[.,]\\d+)?)';
const SEP = '[^\\d\\n]{0,12}?';

const FIELDS = {
  fe: ['fe', 'залізо', 'заліза', 'железо', 'железа'],
  mn: ['mn', 'марганець', 'марганцю', 'марганец', 'марганца'],
  hardness: ['жорсткість', 'жорсткості', 'жорстк', 'жесткость', 'жесткости', 'жестк', 'hardness'],
  ph: ['ph', 'рн', 'рh'],
  oxidability: ['окиснюваність', 'окиснюваності', 'окисн', 'окисляемость', 'окисл', 'перманганатна', 'по'],
  ammonium: ['амоній', 'амонію', 'аммоний', 'аммония', 'амон', 'nh4'],
  nitrates: ['нітрати', 'нітратів', 'нітрат', 'нитраты', 'нитрат', 'no3'],
  turbidity: ['каламутність', 'каламутн', 'мутность', 'мутн', 'ntu'],
  color: ['кольоровість', 'кольоров', 'цветность', 'цветн'],
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toNum = (s) => Number(s.replace(',', '.'));

function normalizePhone(s) {
  const d = String(s || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('380')) return `+${d}`;
  if (d.length === 11 && d.startsWith('80')) return `+3${d}`;
  if (d.length === 10 && d.startsWith('0')) return `+38${d}`;
  return null;
}

function parseText(text = '') {
  const t = ` ${text.toLowerCase().replace(/ё/g, 'е')} `;
  const out = {};

  for (const [key, words] of Object.entries(FIELDS)) {
    for (const w of words) {
      // короткі ключі (fe, ph, по) — тільки як окреме слово, довгі — допускають закінчення
      const tail = w.length <= 3 ? '(?![a-zа-яіїєґ0-9])' : '[a-zа-яіїєґ]*';
      const re = new RegExp(`(?:^|[^a-zа-яіїєґ])${esc(w)}${tail}${SEP}${N}`, 'i');
      const m = t.match(re);
      if (m) { out[key] = toNum(m[1]); break; }
    }
  }

  if (/свердл|скваж|колод|артез/.test(t)) out.source = 'well';
  if (/центр|міськ|городск|водопровід|водопровод|водоканал/.test(t)) out.source = 'central';
  if (/преміум|премиум|clack|клак/.test(t)) out.segment = 'premium';
  else if (/бюджет|економ|эконом|масов|runxin|рунксин/.test(t)) out.segment = 'mass';

  if (/(без|нема[є]?|немає|нет)\s+(запаху|запаха|сірковод|сероводор|h2s)/.test(t)) out.h2s = false;
  else if (/сірковод|сероводор|h2s|тухл|яйц/.test(t)) out.h2s = true;
  if (/хлор/.test(t)) out.chlorine = !/(без|нема[є]?|немає|нет)\s+хлор/.test(t);

  let m = t.match(/(\d+)\s*(?:люд|осіб|особ|чол|мешк|чел|прожив)/);
  if (m) out.people = Number(m[1]);
  m = t.match(/(\d+)\s*(?:санвуз|с\/в|сан\.?\s*вуз|ванн|туалет)/);
  if (m) out.baths = Number(m[1]);
  m = t.match(new RegExp(`${N}\\s*(?:м3|м³|куб)[^\\n]{0,4}(?:год|ч)`));
  if (m) out.flow = toNum(m[1]);

  // Контакти клієнта
  const phoneM = text.match(/(\+?3?8?[\s(-]*0\d{2}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2})/);
  const phone = phoneM && normalizePhone(phoneM[1]);
  if (phone) out.phone = phone;

  const nameM = text.match(/(?:клієнт|клиент|піб|пiб|фио|ім'я|имя|замовник)\s*[:\-–]\s*([^,\n+\d]+)/i);
  if (nameM) out.name = nameM[1].trim();
  const cityM = text.match(/(?:місто|город|адреса|адрес|нп|н\.п\.)\s*[:\-–]\s*([^\n]+)/i);
  if (cityM) out.address = cityM[1].trim();

  return out;
}

function buildManagerComment(sel, extra = '') {
  const p = sel.input;
  const src = p.source === 'central' ? 'централізоване' : 'свердловина/колодязь';
  const analysis = [
    `Джерело: ${src}`,
    `Fe ${p.fe}, Mn ${p.mn} мг/л; жорсткість ${p.hardness} мг-екв/л; pH ${p.ph ?? '—'}`,
    p.oxidability ? `Окиснюваність ${p.oxidability}` : null,
    p.ammonium ? `Амоній ${p.ammonium}` : null,
    p.nitrates ? `Нітрати ${p.nitrates}` : null,
    p.turbidity ? `Каламутність ${p.turbidity} NTU` : null,
    p.color ? `Кольоровість ${p.color}°` : null,
    p.h2s ? 'Сірководень: так' : null,
    `Мешканців ${p.people}, санвузлів ${p.baths}, пікова витрата ${sel.flow} м³/год`,
    `Сегмент: ${p.segment === 'premium' ? 'преміум (Clack)' : 'масовий (Runxin)'}`,
  ].filter(Boolean);
  const stages = sel.stages.map((s, i) => `${i + 1}. ${s.title} — колона ${s.column} (${s.why})`);
  return [
    '🤖 Підбір з Telegram-бота WaterHub',
    ...analysis,
    '',
    'Система:',
    ...stages,
    ...(sel.warnings.length ? ['', '⚠️ ' + sel.warnings.join('\n⚠️ ')] : []),
    ...(extra ? ['', extra] : []),
  ].join('\n');
}

// ===== Обробник оновлення Telegram для Make (код-модуль) =====
// Вхід (input): text, fromId, chatId, msgId, cbId, cbData, cbFromId, cbChatId, cbMsgId, cbText
const ALLOWED_USER_IDS = ['328615342']; // Telegram ID менеджерів, яким дозволено бота
const KEYCRM_SOURCE_ID = 21;            // 🔬 Аналіз води
const MARK = '📋 Дані менеджера:';

const WATER_KEYS = ['fe', 'mn', 'hardness', 'ph', 'oxidability', 'ammonium', 'nitrates', 'turbidity', 'color', 'h2s'];
const escH = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (n) => (n == null ? '—' : `${Math.round(n).toLocaleString('uk-UA')} грн`);
const allowed = (id) => ALLOWED_USER_IDS.includes(String(id));

const HELP = `Надішліть дані клієнта одним повідомленням, наприклад:

<code>Свердловина, Fe 2.5, Mn 0.3, жорсткість 9, pH 7.1, амоній 0.8, 4 людини, 2 санвузли, преміум
Клієнт: Іван Петренко, +380671234567
Місто: Буча</code>

Я підберу систему з каталогу WaterHub, а кнопкою створю замовлення в KeyCRM.
Сегмент: «масовий» (Runxin, за замовчуванням) або «преміум» (Clack).`;

function formatSelection(sel, client) {
  const out = [`<b>💧 Підбір системи</b> · витрата ${sel.flow} м³/год · ${sel.input.people} мешк.`];
  if (!sel.stages.length) out.push('\nОсновна система не потрібна.');
  sel.stages.forEach((s, i) => {
    out.push(`\n<b>${i + 1}. ${escH(s.title)}</b> — колона ${s.column}\n<i>${escH(s.why)}</i>`);
    for (const n of s.notes) out.push(`• ${escH(n)}`);
  });
  if (sel.lines.length) {
    out.push('\n<b>Специфікація:</b>');
    for (const l of sel.lines) out.push(`• ${escH(l.name)} × ${l.qty} — ${l.price == null ? 'ціну уточнити' : money(l.sum)}`);
    out.push(`\n<b>Разом: ${money(sel.total)}</b>${sel.missingPrices.length ? ' + позиції без ціни' : ''}`);
  }
  for (const w of sel.warnings) out.push(`⚠️ ${escH(w)}`);
  if (client.name || client.phone) out.push(`\n👤 ${escH(client.name || '—')} · ${escH(client.phone || 'немає телефону')}${client.address ? ' · ' + escH(client.address) : ''}`);
  return out.join('\n');
}

function orderBody(parsed, sel, managerTgId) {
  const missing = sel.lines.filter((l) => l.price == null).map((l) => l.name);
  const extra = missing.length ? `⚠️ ЦІНИ УТОЧНИТИ (в замовленні 0 грн): ${missing.join('; ')}` : '';
  const body = {
    source_id: KEYCRM_SOURCE_ID,
    buyer: { full_name: parsed.name, phone: parsed.phone },
    products: sel.lines.map((l) => ({ sku: l.sku, name: l.name, price: l.price || 0, quantity: l.qty, unit_type: l.unit })),
    manager_comment: buildManagerComment(sel, [extra, `Створено з Telegram (менеджер ${managerTgId})`].filter(Boolean).join('\n')),
  };
  if (parsed.address) body.shipping = { shipping_address_city: parsed.address, recipient_full_name: parsed.name, recipient_phone: parsed.phone };
  return body;
}

function handle(inp) {
  const res = { route: 'none' };

  // --- Натискання кнопки «Створити замовлення»
  if (inp.cbId) {
    res.cbAnswer = { callback_query_id: inp.cbId };
    if (!allowed(inp.cbFromId)) { res.route = 'cbonly'; res.cbAnswer.text = 'Доступ закрито'; return res; }
    const src = String(inp.cbText || '');
    const i = src.indexOf(MARK);
    const parsed = i >= 0 ? parseText(src.slice(i + MARK.length)) : {};
    const sel = selectSystem(parsed);
    if (!parsed.name || !parsed.phone || !sel.lines.length) {
      res.route = 'cbonly';
      res.cbAnswer.text = 'Бракує ПІБ/телефону клієнта — надішліть дані ще раз з «Клієнт: …»';
      res.cbAnswer.show_alert = true;
      return res;
    }
    res.route = 'order';
    res.cbAnswer.text = 'Створюю замовлення…';
    res.clearMarkup = { chat_id: inp.cbChatId, message_id: Number(inp.cbMsgId), reply_markup: { inline_keyboard: [] } };
    res.orderJson = JSON.stringify(orderBody(parsed, sel, inp.cbFromId));
    res.chatId = String(inp.cbChatId);
    res.msgId = Number(inp.cbMsgId);
    res.total = Math.round(sel.total);
    res.missingCount = sel.missingPrices.length;
    res.clientName = parsed.name;
    return res;
  }

  // --- Повідомлення
  if (!inp.chatId) return res;
  const reply = { chat_id: String(inp.chatId), parse_mode: 'HTML', disable_web_page_preview: true, reply_to_message_id: Number(inp.msgId) || undefined };
  res.route = 'reply';
  res.reply = reply;
  if (!allowed(inp.fromId)) { reply.text = `Доступ закрито. Ваш Telegram ID: <code>${escH(inp.fromId)}</code> — передайте його адміністратору.`; return res; }
  const text = String(inp.text || '');
  if (!text || text.startsWith('/start') || text.startsWith('/help')) { reply.text = HELP; return res; }

  const parsed = parseText(text);
  if (!WATER_KEYS.some((k) => k in parsed)) { reply.text = 'Не знайшов показників аналізу води.\n\n' + HELP; return res; }
  const sel = selectSystem(parsed);
  const client = { name: parsed.name, phone: parsed.phone, address: parsed.address };
  let footer = '';
  if (client.name && client.phone && sel.lines.length) {
    reply.reply_markup = { inline_keyboard: [[{ text: '✅ Створити замовлення в KeyCRM', callback_data: 'order' }]] };
    if (sel.missingPrices.length) footer = '\n\nℹ️ Позиції без ціни підуть у замовлення з 0 грн — виправте в KeyCRM.';
  } else if (sel.lines.length) {
    footer = '\n\nℹ️ Для замовлення додайте рядок «Клієнт: ПІБ, телефон» і надішліть ще раз.';
  }
  reply.text = formatSelection(sel, client) + footer + `\n\n<blockquote expandable>${MARK}\n${escH(text)}</blockquote>`;
  if (reply.text.length > 4000) reply.text = reply.text.slice(0, 4000);
  return res;
}

// Make не розгортає вкладені об'єкти в тілі запиту — віддаємо пласкі поля, кнопки як JSON-рядок
const r = handle(input);
const EMPTY_KB = '{"inline_keyboard":[]}';
r.replyChatId = r.reply ? r.reply.chat_id : '';
r.replyText = r.reply ? r.reply.text : '';
r.replyToId = r.reply && r.reply.reply_to_message_id ? r.reply.reply_to_message_id : '';
r.replyMarkup = r.reply && r.reply.reply_markup ? JSON.stringify(r.reply.reply_markup) : EMPTY_KB;
r.cbQueryId = r.cbAnswer ? r.cbAnswer.callback_query_id : '';
r.cbAnswerText = r.cbAnswer && r.cbAnswer.text ? r.cbAnswer.text : '';
r.cbShowAlert = !!(r.cbAnswer && r.cbAnswer.show_alert);
r.clearChatId = r.clearMarkup ? String(r.clearMarkup.chat_id) : '';
r.clearMsgId = r.clearMarkup ? r.clearMarkup.message_id : '';
r.emptyKeyboard = EMPTY_KB;
return r;
