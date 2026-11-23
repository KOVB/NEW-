// Каталог WaterHub — перенесено з Sheet «WaterHub — довідник: колони, клапани, засипки».
// price — ціна-орієнтир ринку, грн (для діапазону береться верхня межа); null — ціну треба уточнити.
// vol — об'єм фасування засипки в літрах (для розрахунку кількості мішків).

export const CATALOG = [
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

export const BY_SKU = Object.fromEntries(CATALOG.map((p) => [p.sku, p]));

export function item(sku) {
  const p = BY_SKU[sku];
  if (!p) throw new Error(`SKU ${sku} відсутній у каталозі`);
  return p;
}
