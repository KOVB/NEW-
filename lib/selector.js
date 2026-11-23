// Підбір системи водопідготовки за аналізом води та споживанням.
// Логіка детермінована: однакові вхідні дані → однакова специфікація.
import { item } from './catalog.js';

// Колони: fill — об'єм засипки для іонообмінних/комплексних засипок (л),
// soft — пікова витрата для пом'якшення/комплексної засипки (м³/год),
// filt — пікова витрата для фільтрів з промивкою (знезалізнення, вугілля, механіка).
export const COLUMNS = [
  { size: '0817', sku: 'WH-COL-0817', fill: 7.5, soft: 0.6, filt: 0.4, tank: 'WH-BT-070', gravel: 0 },
  { size: '1017', sku: 'WH-COL-1017', fill: 12, soft: 0.8, filt: 0.5, tank: 'WH-BT-070', gravel: 0 },
  { size: '1035', sku: 'WH-COL-1035', fill: 25, soft: 1.2, filt: 0.8, tank: 'WH-BT-070', gravel: 1 },
  { size: '1054', sku: 'WH-COL-1054', fill: 40, soft: 1.6, filt: 1.1, tank: 'WH-BT-070', gravel: 1 },
  { size: '1252', sku: 'WH-COL-1252', fill: 50, soft: 2.0, filt: 1.4, tank: 'WH-BT-100', gravel: 1 },
  { size: '1354', sku: 'WH-COL-1354', fill: 62, soft: 2.4, filt: 1.7, tank: 'WH-BT-100', gravel: 2 },
  { size: '1465', sku: 'WH-COL-1465', fill: 85, soft: 3.0, filt: 2.1, tank: 'WH-BT-150', gravel: 2 },
];

// Пороги (ДСанПіН 2.2.4-171-10 + комфортна жорсткість для побуту).
export const LIMITS = {
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

export function normalizeInput(raw = {}) {
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

export function peakFlow(p) {
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
export function packsFor(volume, skus) {
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

export function selectSystem(raw) {
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
  if (missingPrices.length) warnings.push(`Немає ціни в каталозі для ${missingPrices.length} поз. — вкажіть вручну перед створенням замовлення.`);

  return { input: p, flow, dailyM3: dailyL / 1000, stages, lines, total, missingPrices, warnings };
}
