// POST /api/order — створення замовлення в KeyCRM з Mini App.
// Тіло: { initData, params, client: {name, phone, email?, address?}, lines: [{sku, qty, price}], comment? }
import { selectSystem } from '../lib/selector.js';
import { BY_SKU } from '../lib/catalog.js';
import { verifyInitData, isAllowed, tg } from '../lib/telegram.js';
import { createOrder, orderUrl } from '../lib/keycrm.js';
import { normalizePhone } from '../lib/parser.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = req.body || {};

  const user = verifyInitData(body.initData);
  if (!user) return res.status(401).json({ error: 'Відкрийте форму з Telegram-бота' });
  if (!isAllowed(user.id)) return res.status(403).json({ error: `Немає доступу (ID ${user.id})` });

  const name = String(body.client?.name || '').trim();
  const phone = normalizePhone(body.client?.phone);
  if (!name) return res.status(400).json({ error: "Вкажіть ім'я клієнта" });
  if (!phone) return res.status(400).json({ error: 'Невірний телефон (формат +380XXXXXXXXX)' });

  const selection = selectSystem(body.params || {});
  // Позиції приходять з форми (менеджер міг змінити к-сть/ціну) — назви та одиниці беремо лише з каталогу.
  const lines = (Array.isArray(body.lines) ? body.lines : [])
    .filter((l) => BY_SKU[l.sku] && Number(l.qty) > 0)
    .map((l) => ({ sku: l.sku, name: BY_SKU[l.sku].name, unit: BY_SKU[l.sku].unit, qty: Number(l.qty), price: Number(l.price) || 0 }));
  if (!lines.length) return res.status(400).json({ error: 'Специфікація порожня' });
  const zero = lines.filter((l) => !l.price);
  if (zero.length) return res.status(400).json({ error: `Вкажіть ціну: ${zero.map((l) => l.name).join('; ')}` });

  try {
    const order = await createOrder({
      client: { name, phone, email: body.client?.email, address: body.client?.address },
      lines,
      selection,
      telegramUserId: user.id,
      comment: body.comment,
    });
    const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const url = orderUrl(order.id);
    // Підтвердження в чат менеджера
    await tg('sendMessage', {
      chat_id: user.id,
      text: `✅ Замовлення №${order.id} створено в KeyCRM\n👤 ${name} · ${phone}\n💰 ${Math.round(total).toLocaleString('uk-UA')} грн${url ? `\n${url}` : ''}`,
    }).catch(() => {});
    return res.status(200).json({ ok: true, id: order.id, url, total });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: e.message, details: e.details });
  }
}
