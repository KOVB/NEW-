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
