// Річні комплекти Raifil для осмосу (−30%) — обробник оновлення Telegram.
// Вхід: text, chatId, msgId, firstName, lastName, username, cbId, cbData, cbChatId, replyText, contactPhone
const PHOTO = 'https://keycrm.s3.de.io.cloud.ovh.net/storage/whservice/uploads/2026-11-24/8e0mbvdvwqOfOzfr3AM8Omux0E0ZfcZH.jpg';
const DISCOUNT = 0.30;
const KEYCRM_SOURCE_ID = 4; // 👤 Сервіс
const MARK = '🧾 Комплект';

// Роздрібні ціни KeyCRM на 24.11.2026
const P = {
  '1097': { name: 'Набір картриджі Raifil 1-2-3 для систем зворотного осмоса', price: 790 },
  '7294': { name: 'Постфільтр вугільний RAIFIL', price: 430 },
  '7295': { name: 'Мінералізатор RAIFIL', price: 550 },
  '701456': { name: 'Raifil мембрана 50 GAL', price: 1290 },
};
const KITS = {
  std: { title: 'Стандарт', lines: [['1097', 4], ['7294', 2], ['701456', 1]] },
  max: { title: 'MAX + мінералізація', lines: [['1097', 4], ['7294', 2], ['701456', 1], ['7295', 2]] },
};
const disc = (p) => Math.round(p * (1 - DISCOUNT));
const kitSum = (k) => KITS[k].lines.reduce((s, [sku, q]) => s + P[sku].price * q, 0);
const kitNew = (k) => KITS[k].lines.reduce((s, [sku, q]) => s + disc(P[sku].price) * q, 0);
const money = (n) => n.toLocaleString('uk-UA').replace(/\s/g, ' ') + ' грн';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function normalizePhone(s) {
  const d = String(s || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('380')) return `+${d}`;
  if (d.length === 11 && d.startsWith('80')) return `+3${d}`;
  if (d.length === 10 && d.startsWith('0')) return `+38${d}`;
  if (d.length === 9) return `+380${d}`;
  return null;
}

function caption() {
  const kit = (k, icon) => {
    const it = KITS[k].lines.map(([sku, q]) => `• ${esc(P[sku].name)} × ${q}`).join('\n');
    return `${icon} <b>${KITS[k].title}</b>\n${it}\n<s>${money(kitSum(k))}</s> → <b>${money(kitNew(k))}</b> (економія ${money(kitSum(k) - kitNew(k))})`;
  };
  return [
    '💧 <b>Річний комплект картриджів Raifil для осмосу — −30%</b>',
    'Усе для заміни на рік: нижня трійка раз на 3 міс., постфільтр раз на 6 міс., мембрана 50 GPD.',
    '',
    kit('std', '🔵'),
    '',
    kit('max', '🩵'),
    '',
    'Оберіть комплект кнопкою нижче. Менеджер передзвонить, щоб узгодити доставку або заміну майстром.',
  ].join('\n');
}

function handle(inp) {
  const r = { route: 'none' };
  const text = String(inp.text || '').trim();
  const cb = String(inp.cbData || '');

  // Кнопка вибору комплекту
  if (inp.cbId && cb.startsWith('kit_')) {
    const k = cb.slice(4);
    if (!KITS[k]) return r;
    r.route = 'ask';
    r.cbQueryId = inp.cbId;
    r.chatId = String(inp.cbChatId);
    r.text = `${MARK} «${KITS[k].title}» [${k}] — ${money(kitNew(k))}\n\n📱 Напишіть ваш номер телефону у відповідь на це повідомлення (наприклад 0671234567).`;
    r.markup = JSON.stringify({ force_reply: true, input_field_placeholder: '067 123 45 67' });
    return r;
  }

  // Відповідь з телефоном на повідомлення бота
  const rt = String(inp.replyText || '');
  if (rt.includes(MARK)) {
    const m = rt.match(/\[(std|max)\]/);
    const k = m && m[1];
    const phone = normalizePhone(inp.contactPhone || text);
    r.chatId = String(inp.chatId);
    if (!k) return r;
    if (!phone) {
      r.route = 'ask';
      r.text = `${MARK} «${KITS[k].title}» [${k}] — ${money(kitNew(k))}\n\n⚠️ Не розпізнав номер. Напишіть його ще раз у відповідь на це повідомлення, наприклад 0671234567.`;
      r.markup = JSON.stringify({ force_reply: true, input_field_placeholder: '067 123 45 67' });
      return r;
    }
    const name = [inp.firstName, inp.lastName].filter(Boolean).join(' ') || 'Клієнт Telegram';
    const tg = inp.username ? `@${inp.username}` : `id ${inp.chatId}`;
    const body = {
      source_id: KEYCRM_SOURCE_ID,
      buyer: { full_name: name, phone },
      products: KITS[k].lines.map(([sku, q]) => ({ sku, name: P[sku].name, price: disc(P[sku].price), quantity: q })),
      manager_comment: [
        `🧾 Річний комплект Raifil «${KITS[k].title}» −30% (Telegram-бот)`,
        `Роздріб ${money(kitSum(k))} → ${money(kitNew(k))}`,
        `Telegram: ${tg}`,
        'Узгодити: доставка чи заміна майстром.',
      ].join('\n'),
    };
    r.route = 'order';
    r.orderJson = JSON.stringify(body);
    r.kitTitle = KITS[k].title;
    r.total = money(kitNew(k));
    r.phone = phone;
    r.clientName = name;
    r.tg = tg;
    r.removeKb = JSON.stringify({ remove_keyboard: true });
    return r;
  }

  // Показ каталогу
  // ключові слова — лише в особистому чаті, щоб бот не відповідав на розмови в робочій групі
  const isPrivate = !String(inp.chatId || '').startsWith('-');
  if (/^\/(start|komplekt|kits)\b/i.test(text) || (isPrivate && /комплект|картридж/i.test(text))) {
    r.route = 'catalog';
    r.chatId = String(inp.chatId);
    r.photo = PHOTO;
    r.caption = caption();
    r.markup = JSON.stringify({ inline_keyboard: [
      [{ text: `🔵 Стандарт — ${money(kitNew('std'))}`, callback_data: 'kit_std' }],
      [{ text: `🩵 MAX + мінералізація — ${money(kitNew('max'))}`, callback_data: 'kit_max' }],
    ] });
    return r;
  }
  return r;
}

const res = handle(input);
for (const key of ['cbQueryId', 'chatId', 'text', 'markup', 'photo', 'caption', 'orderJson', 'kitTitle', 'total', 'phone', 'clientName', 'tg', 'removeKb']) {
  if (res[key] === undefined) res[key] = '';
}
return res;
