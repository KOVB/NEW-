import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectSystem, packsFor, peakFlow, normalizeInput } from '../lib/selector.js';
import { parseText, normalizePhone } from '../lib/parser.js';
import { BY_SKU } from '../lib/catalog.js';
import { buildManagerComment } from '../lib/keycrm.js';

const skus = (sel) => sel.lines.map((l) => l.sku);

test('типова свердловина: помірне Fe + жорсткість → одна колона з комплексною засипкою', () => {
  const sel = selectSystem({ source: 'well', fe: 2.5, mn: 0.3, hardness: 9, ph: 7.1, ammonium: 0.8, people: 4, baths: 2 });
  assert.equal(sel.stages.length, 1);
  assert.equal(sel.stages[0].key, 'complex');
  assert.ok(skus(sel).includes('WH-VLV-RX-F63C3'));
  assert.ok(skus(sel).some((s) => s.startsWith('WH-MED-CT-CTF')));
  assert.ok(skus(sel).some((s) => s.startsWith('WH-BT-')));
});

test('важке залізо + H2S → окреме знезалізнення на Clack TC, потім пом\'якшення', () => {
  const sel = selectSystem({ source: 'well', fe: 7, mn: 0.5, hardness: 8, h2s: true, people: 4, baths: 2 });
  assert.deepEqual(sel.stages.map((s) => s.key), ['iron', 'softener']);
  assert.ok(skus(sel).includes('WH-VLV-CLACK-TC'));
  assert.ok(skus(sel).includes('WH-MED-CT-KATALOX-30'));
  assert.ok(skus(sel).includes('WH-MED-RF-C100E-25'));
});

test('преміум сегмент → Clack + XaiR', () => {
  const sel = selectSystem({ fe: 1.2, hardness: 2, segment: 'premium', people: 3 });
  assert.equal(sel.stages[0].key, 'iron');
  assert.ok(skus(sel).includes('WH-VLV-CLACK-TC'));
  assert.ok(skus(sel).includes('WH-MED-FL-XAIR-15'));
});

test('лише жорсткість → пом\'якшувач на смолі', () => {
  const sel = selectSystem({ hardness: 7, people: 3, baths: 1 });
  assert.deepEqual(sel.stages.map((s) => s.key), ['softener']);
  assert.ok(sel.total > 0);
});

test('міська вода → вугілля + пом\'якшення', () => {
  const sel = selectSystem({ source: 'central', hardness: 6, people: 3 });
  assert.deepEqual(sel.stages.map((s) => s.key), ['carbon', 'softener']);
});

test('нітрати → окрема ступінь NR-1', () => {
  const sel = selectSystem({ hardness: 6, nitrates: 80, people: 3 });
  assert.ok(sel.stages.some((s) => s.key === 'nitrates'));
  assert.ok(skus(sel).includes('WH-MED-RF-NR1-25'));
});

test('вода в нормі → без системи і з попередженням', () => {
  const sel = selectSystem({ fe: 0.1, hardness: 2, ph: 7.2 });
  assert.equal(sel.stages.length, 0);
  assert.ok(sel.warnings[0].includes('механічного'));
});

test('низький pH → попередження', () => {
  const sel = selectSystem({ fe: 1, hardness: 5, ph: 6 });
  assert.ok(sel.warnings.some((w) => w.includes('pH')));
});

test('колона росте з витратою', () => {
  const small = selectSystem({ hardness: 6, people: 2, baths: 1 });
  const big = selectSystem({ hardness: 6, people: 8, baths: 4 });
  const size = (s) => Number(s.stages[0].column);
  assert.ok(size(big) > size(small));
});

test('усі SKU специфікації є в каталозі', () => {
  const sel = selectSystem({ source: 'central', fe: 8, mn: 1.5, hardness: 12, nitrates: 70, turbidity: 5, color: 40, oxidability: 12, h2s: true, people: 6, baths: 3 });
  for (const l of sel.lines) assert.ok(BY_SKU[l.sku], l.sku);
  assert.ok(sel.lines.every((l) => l.qty > 0));
});

test('packsFor: 62 л комплексної засипки = 2×25 + 1×12', () => {
  assert.deepEqual(packsFor(62, ['WH-MED-CT-CTF-25', 'WH-MED-CT-CTF-12']), [
    { sku: 'WH-MED-CT-CTF-25', qty: 2 }, { sku: 'WH-MED-CT-CTF-12', qty: 1 },
  ]);
  assert.deepEqual(packsFor(25, ['WH-MED-CT-CTF-25', 'WH-MED-CT-CTF-12']), [{ sku: 'WH-MED-CT-CTF-25', qty: 1 }]);
});

test('peakFlow', () => {
  assert.equal(peakFlow(normalizeInput({ people: 4, baths: 2 })), 1.5);
  assert.equal(peakFlow(normalizeInput({ flow: 2.2 })), 2.2);
});

test('parseText: український текст менеджера', () => {
  const p = parseText(`Свердловина, Fe 2,5, Mn 0.3, жорсткість 9 мг-екв, pH 7.1, амоній 0.8, окиснюваність 6, 4 людини, 2 санвузли, преміум
Клієнт: Іван Петренко, +38 (067) 123-45-67
Місто: Буча, вул. Вокзальна 1`);
  assert.equal(p.source, 'well');
  assert.equal(p.fe, 2.5);
  assert.equal(p.mn, 0.3);
  assert.equal(p.hardness, 9);
  assert.equal(p.ph, 7.1);
  assert.equal(p.ammonium, 0.8);
  assert.equal(p.oxidability, 6);
  assert.equal(p.people, 4);
  assert.equal(p.baths, 2);
  assert.equal(p.segment, 'premium');
  assert.equal(p.name, 'Іван Петренко');
  assert.equal(p.phone, '+380671234567');
  assert.equal(p.address, 'Буча, вул. Вокзальна 1');
});

test('parseText: російськомовний текст і сірководень', () => {
  const p = parseText('скважина железо 4.2 жесткость 12 запах сероводорода, 5 человек, 0501112233');
  assert.equal(p.fe, 4.2);
  assert.equal(p.hardness, 12);
  assert.equal(p.h2s, true);
  assert.equal(p.people, 5);
  assert.equal(p.phone, '+380501112233');
});

test('parseText: «по» не плутається зі словами', () => {
  const p = parseText('попередньо Fe 1, жорсткість 5');
  assert.equal(p.oxidability, undefined);
});

test('normalizePhone', () => {
  assert.equal(normalizePhone('067 123 45 67'), '+380671234567');
  assert.equal(normalizePhone('+380671234567'), '+380671234567');
  assert.equal(normalizePhone('12345'), null);
});

test('коментар для KeyCRM містить аналіз і ступені', () => {
  const sel = selectSystem({ fe: 2, hardness: 8, people: 4 });
  const c = buildManagerComment(sel, 'дзвонити після 18:00');
  assert.ok(c.includes('Fe 2'));
  assert.ok(c.includes('колона'));
  assert.ok(c.includes('дзвонити після 18:00'));
});

test('знезалізнення 1354: Katalox — 2 мішки, смола без 15 пакетів по 1 л', () => {
  const sel = selectSystem({ fe: 7, mn: 0.5, hardness: 8, h2s: true, people: 4, baths: 2 });
  const q = (sku) => sel.lines.find((l) => l.sku === sku)?.qty;
  assert.equal(q('WH-MED-CT-KATALOX-30'), 2);
  assert.ok(!(q('WH-MED-RF-C100E-1') > 5));
});
