// Клієнт KeyCRM Open API (https://openapi.keycrm.app/v1). Токен — лише зі змінної середовища.
const BASE = process.env.KEYCRM_API_URL || 'https://openapi.keycrm.app/v1';

async function call(path, { method = 'GET', body } = {}) {
  const token = process.env.KEYCRM_API_KEY;
  if (!token) throw new Error('KEYCRM_API_KEY не задано');
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.message || data?.error || text.slice(0, 300);
    const err = new Error(`KeyCRM ${res.status}: ${msg}`);
    err.status = res.status;
    err.details = data?.errors;
    throw err;
  }
  return data;
}

// "123456:5,789012:7" → { '123456': 5, '789012': 7 }
function managerMap() {
  const out = {};
  for (const pair of (process.env.KEYCRM_MANAGER_MAP || '').split(',')) {
    const [tg, id] = pair.split(':').map((s) => s && s.trim());
    if (tg && id) out[tg] = Number(id);
  }
  return out;
}

export function buildManagerComment(sel, extra = '') {
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

/**
 * Створює замовлення.
 * @param {object} p
 * @param {object} p.client  { name, phone, email?, address? }
 * @param {Array}  p.lines   [{ sku, name, qty, price, unit }]
 * @param {object} p.selection  результат selectSystem (для коментаря)
 * @param {number|string} p.telegramUserId  — для прив'язки менеджера
 * @param {string} p.comment — додатковий коментар менеджера
 */
export async function createOrder({ client, lines, selection, telegramUserId, comment }) {
  const sourceId = Number(process.env.KEYCRM_SOURCE_ID);
  if (!sourceId) throw new Error('KEYCRM_SOURCE_ID не задано');

  const body = {
    source_id: sourceId,
    buyer: {
      full_name: client.name,
      phone: client.phone,
      ...(client.email ? { email: client.email } : {}),
    },
    products: lines.filter((l) => l.qty > 0).map((l) => ({
      sku: l.sku,
      name: l.name,
      price: Number(l.price) || 0,
      quantity: Number(l.qty),
      unit_type: l.unit,
    })),
    manager_comment: buildManagerComment(selection, comment),
  };
  if (client.address) {
    body.shipping = { shipping_address_city: client.address, recipient_full_name: client.name, recipient_phone: client.phone };
  }
  const managerId = managerMap()[String(telegramUserId)];
  if (managerId) body.manager_id = managerId;

  const order = await call('/order', { method: 'POST', body });
  return order;
}

export function orderUrl(id) {
  const domain = process.env.KEYCRM_DOMAIN; // напр. waterhub.keycrm.app
  return domain ? `https://${domain}/app/orders/view/${id}` : null;
}

export const keycrm = { call };
