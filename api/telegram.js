// Вебхук Telegram-бота.
import { parseText } from '../lib/parser.js';
import { selectSystem } from '../lib/selector.js';
import { tg, isAllowed, formatSelection } from '../lib/telegram.js';
import { createOrder, orderUrl } from '../lib/keycrm.js';

const WATER_KEYS = ['fe', 'mn', 'hardness', 'ph', 'oxidability', 'ammonium', 'nitrates', 'turbidity', 'color', 'h2s'];

const HELP = `Надішліть дані клієнта одним повідомленням, наприклад:

<code>Свердловина, Fe 2.5, Mn 0.3, жорсткість 9, pH 7.1, амоній 0.8, 4 людини, 2 санвузли, преміум
Клієнт: Іван Петренко, +380671234567
Місто: Буча</code>

Я підберу систему з каталогу WaterHub і створю замовлення в KeyCRM.
Або відкрийте форму кнопкою нижче.`;

function webAppUrl(req, data) {
  const base = process.env.WEBAPP_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}/`;
  if (!data) return base;
  const d = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${base}${base.includes('?') ? '&' : '?'}d=${d}`;
}

async function handleMessage(req, msg) {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    return tg('sendMessage', { chat_id: chatId, text: `Доступ закрито. Ваш Telegram ID: ${msg.from?.id}. Передайте його адміністратору.` });
  }
  const text = msg.text || '';
  const formBtn = (data) => ({ text: '📝 Відкрити форму', web_app: { url: webAppUrl(req, data) } });

  if (!text || text.startsWith('/start') || text.startsWith('/help')) {
    return tg('sendMessage', {
      chat_id: chatId, text: HELP, parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[formBtn()]] },
    });
  }

  const parsed = parseText(text);
  if (!WATER_KEYS.some((k) => k in parsed)) {
    return tg('sendMessage', { chat_id: chatId, text: 'Не знайшов показників аналізу води.\n\n' + HELP, parse_mode: 'HTML' });
  }

  const sel = selectSystem(parsed);
  const client = { name: parsed.name, phone: parsed.phone, address: parsed.address };
  const buttons = [[formBtn(parsed)]];
  if (client.name && client.phone && !sel.missingPrices.length && sel.lines.length) {
    buttons.unshift([{ text: '✅ Створити замовлення в KeyCRM', callback_data: 'order' }]);
  }
  let footer = '';
  if (!client.name || !client.phone) footer = '\n\nℹ️ Для замовлення додайте «Клієнт: ПІБ, телефон» або відкрийте форму.';
  else if (sel.missingPrices.length) footer = '\n\nℹ️ Є позиції без ціни — оформіть замовлення через форму, вказавши ціни.';

  return tg('sendMessage', {
    chat_id: chatId,
    reply_to_message_id: msg.message_id,
    text: formatSelection(sel, client) + footer,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: buttons },
  });
}

async function handleCallback(cb) {
  const msg = cb.message;
  if (!isAllowed(cb.from.id)) return tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Доступ закрито' });
  if (cb.data !== 'order') return tg('answerCallbackQuery', { callback_query_id: cb.id });

  const source = msg?.reply_to_message?.text;
  if (!source) return tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Не знайшов вихідне повідомлення — надішліть дані ще раз', show_alert: true });

  const parsed = parseText(source);
  const sel = selectSystem(parsed);
  if (!parsed.name || !parsed.phone || sel.missingPrices.length || !sel.lines.length) {
    return tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Бракує контактів або цін — оформіть через форму', show_alert: true });
  }

  // Одразу прибираємо кнопку, щоб уникнути подвійного створення
  await tg('editMessageReplyMarkup', { chat_id: msg.chat.id, message_id: msg.message_id, reply_markup: { inline_keyboard: [] } });
  await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Створюю замовлення…' });
  try {
    const order = await createOrder({
      client: { name: parsed.name, phone: parsed.phone, address: parsed.address },
      lines: sel.lines,
      selection: sel,
      telegramUserId: cb.from.id,
    });
    const url = orderUrl(order.id);
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      reply_to_message_id: msg.message_id,
      text: `✅ Замовлення №${order.id} створено в KeyCRM на ${Math.round(sel.total).toLocaleString('uk-UA')} грн.${url ? `\n${url}` : ''}`,
    });
  } catch (e) {
    console.error(e);
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      reply_to_message_id: msg.message_id,
      text: `❌ Не вдалося створити замовлення: ${e.message}\nКнопку повернуто — можна спробувати ще раз.`,
    });
    // повертаємо кнопку на повідомлення з підбором (reply_to_message там лишається вихідним)
    await tg('editMessageReplyMarkup', {
      chat_id: msg.chat.id, message_id: msg.message_id,
      reply_markup: { inline_keyboard: [[{ text: '✅ Створити замовлення в KeyCRM', callback_data: 'order' }]] },
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('WaterHub bot webhook');
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) return res.status(401).send('unauthorized');
  const update = req.body || {};
  try {
    if (update.message) await handleMessage(req, update.message);
    else if (update.callback_query) await handleCallback(update.callback_query);
  } catch (e) {
    console.error('update failed', e);
  }
  return res.status(200).json({ ok: true });
}
