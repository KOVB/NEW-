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

export function normalizePhone(s) {
  const d = String(s || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('380')) return `+${d}`;
  if (d.length === 11 && d.startsWith('80')) return `+3${d}`;
  if (d.length === 10 && d.startsWith('0')) return `+38${d}`;
  return null;
}

export function parseText(text = '') {
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
