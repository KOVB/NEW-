// Генерує blueprint сценарію Make: node make/blueprint.js <telegramConnId> <hookId> <keycrmKeyId>
import { readFileSync, writeFileSync } from 'node:fs';
const [conn, hook, key] = process.argv.slice(2).map(Number);
const code = readFileSync(new URL('./bot-code.js', import.meta.url), 'utf8');
const tgCall = (id, urlMethod, fields, x, y) => ({
  id, module: 'telegram:UniversalAPICall', version: 1, parameters: { __IMTCONN__: conn },
  mapper: { urlMethod, method: 'POST', bodyType: 'assembled_body', body_spec: Object.entries(fields).map(([key, value]) => ({ key, value })) },
  metadata: { designer: { x, y } },
  // збій службового виклику (стара кнопка, повідомлення вже змінене) не зупиняє сценарій
  ...(['answerCallbackQuery', 'editMessageReplyMarkup'].includes(urlMethod) ? { onerror: [{ id: id * 100, module: 'builtin:Resume', version: 1, mapper: {}, metadata: { designer: { x: x, y: y + 150 } } }] } : {}),
});
const REPLY = { chat_id: '{{2.result.replyChatId}}', text: '{{2.result.replyText}}', parse_mode: 'HTML', disable_web_page_preview: 'true', reply_to_message_id: '{{2.result.replyToId}}', allow_sending_without_reply: 'true', reply_markup: '{{2.result.replyMarkup}}' };
const CB = { callback_query_id: '{{2.result.cbQueryId}}', text: '{{2.result.cbAnswerText}}', show_alert: '{{2.result.cbShowAlert}}' };
const CLEAR = { chat_id: '{{2.result.clearChatId}}', message_id: '{{2.result.clearMsgId}}', reply_markup: '{{2.result.emptyKeyboard}}' };
const f = (name, a, o, b) => ({ name, conditions: [[{ a, o, b }]] });
const bp = {
  name: 'WaterHub — Бот підбору систем → KeyCRM (Telegram)',
  metadata: { instant: true, version: 1 },
  flow: [
    { id: 1, module: 'telegram:WatchUpdates', version: 1, parameters: { __IMTHOOK__: hook }, mapper: {}, metadata: { designer: { x: 0, y: 0 } } },
    { id: 2, module: 'code:ExecuteCode', version: 1, parameters: {}, metadata: { designer: { x: 300, y: 0 } },
      mapper: { language: 'javascript', inputFormat: 'editor', codeEditorJavascript: code, input: [
        ['text', '{{1.message.text}}'], ['fromId', '{{1.message.from.id}}'], ['chatId', '{{1.message.chat.id}}'],
        ['msgId', '{{1.message.message_id}}'], ['cbId', '{{1.callback_query.id}}'], ['cbData', '{{1.callback_query.data}}'],
        ['cbFromId', '{{1.callback_query.from.id}}'], ['cbChatId', '{{1.callback_query.message.chat.id}}'],
        ['cbMsgId', '{{1.callback_query.message.message_id}}'], ['cbText', '{{1.callback_query.message.text}}'],
      ].map(([name, value]) => ({ name, value })) } },
    { id: 3, module: 'builtin:BasicRouter', version: 1, mapper: null, metadata: { designer: { x: 600, y: 0 } }, routes: [
      { flow: [{ ...tgCall(4, 'sendMessage', REPLY, 900, -300), filter: f('Відповідь', '{{2.result.route}}', 'text:equal', 'reply') }] },
      { flow: [{ ...tgCall(5, 'answerCallbackQuery', CB, 900, 0), filter: f('Лише відповідь на кнопку', '{{2.result.route}}', 'text:equal', 'cbonly') }] },
      { flow: [
        { ...tgCall(6, 'answerCallbackQuery', CB, 900, 300), filter: f('Створити замовлення', '{{2.result.route}}', 'text:equal', 'order') },
        tgCall(7, 'editMessageReplyMarkup', CLEAR, 1200, 300),
        { id: 8, module: 'http:MakeRequest', version: 4, metadata: { designer: { x: 1500, y: 300 } },
          parameters: { authenticationType: 'apiKey', apiKeyKeychain: key },
          mapper: { url: 'https://openapi.keycrm.app/v1/order', method: 'post', headers: [{ name: 'Accept', value: 'application/json' }],
            contentType: 'json', inputMethod: 'jsonString', jsonStringBodyContent: '{{2.result.orderJson}}', parseResponse: true, stopOnHttpError: false, allowRedirects: true, shareCookies: false, requestCompressedContent: true } },
        { id: 9, module: 'builtin:BasicRouter', version: 1, mapper: null, metadata: { designer: { x: 1800, y: 300 } }, routes: [
          { flow: [{ id: 10, module: 'telegram:UniversalAPICall', version: 1, parameters: { __IMTCONN__: conn }, metadata: { designer: { x: 2100, y: 150 } },
            filter: f('Успіх', '{{8.statusCode}}', 'number:less', '300'),
            mapper: { urlMethod: 'sendMessage', method: 'POST', bodyType: 'assembled_body', body_spec: [
              { key: 'chat_id', value: '{{2.result.chatId}}' }, { key: 'reply_to_message_id', value: '{{2.result.msgId}}' },
              { key: 'text', value: '✅ Замовлення №{{8.data.id}} створено в KeyCRM\n👤 {{2.result.clientName}}\n💰 {{2.result.total}} грн\nПозицій без ціни: {{2.result.missingCount}} (якщо більше 0 — виправте ціни в KeyCRM)' } ] } }] },
          { flow: [{ id: 11, module: 'telegram:UniversalAPICall', version: 1, parameters: { __IMTCONN__: conn }, metadata: { designer: { x: 2100, y: 450 } },
            filter: f('Помилка', '{{8.statusCode}}', 'number:greaterorequal', '300'),
            mapper: { urlMethod: 'sendMessage', method: 'POST', bodyType: 'assembled_body', body_spec: [
              { key: 'chat_id', value: '{{2.result.chatId}}' }, { key: 'reply_to_message_id', value: '{{2.result.msgId}}' },
              { key: 'text', value: '❌ KeyCRM не створив замовлення ({{8.statusCode}}): {{8.data.message}}\nНадішліть дані ще раз або створіть замовлення вручну.' } ] } }] },
        ] },
      ] },
    ] },
  ],
};
// маршрутизатори без mapper
(function strip(fl) { for (const m of fl) { if (m.mapper === null) delete m.mapper; for (const r of m.routes || []) strip(r.flow); } })(bp.flow);
writeFileSync(new URL('./blueprint.json', import.meta.url), JSON.stringify(bp, null, 1));
console.log('make/blueprint.json written');
