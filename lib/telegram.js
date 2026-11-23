import crypto from 'node:crypto';

export async function tg(method, payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN не задано');
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) console.error('Telegram API', method, data.description);
  return data;
}

// Перевірка підпису initData Telegram Mini App (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
export function verifyInitData(initData, maxAgeSec = 24 * 3600) {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const dataCheck = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN || '').digest();
  const calc = crypto.createHmac('sha256', secret).update(dataCheck).digest('hex');
  if (calc.length !== hash.length || !crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(hash))) return null;
  const authDate = Number(params.get('auth_date'));
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;
  try { return JSON.parse(params.get('user') || 'null'); } catch { return null; }
}

export function isAllowed(userId) {
  const list = (process.env.ALLOWED_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return list.length === 0 || list.includes(String(userId));
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (n) => (n == null ? '—' : `${Math.round(n).toLocaleString('uk-UA')} грн`);

export function formatSelection(sel, client = {}) {
  const out = [];
  out.push(`<b>💧 Підбір системи</b> · витрата ${sel.flow} м³/год · ${sel.input.people} мешк.`);
  if (!sel.stages.length) out.push('\nОсновна система не потрібна.');
  sel.stages.forEach((s, i) => {
    out.push(`\n<b>${i + 1}. ${esc(s.title)}</b> — колона ${s.column}\n<i>${esc(s.why)}</i>`);
    for (const n of s.notes) out.push(`• ${esc(n)}`);
  });
  if (sel.lines.length) {
    out.push('\n<b>Специфікація:</b>');
    for (const l of sel.lines) out.push(`• ${esc(l.name)} × ${l.qty} — ${money(l.sum)}`);
    out.push(`\n<b>Разом: ${money(sel.total)}</b>${sel.missingPrices.length ? ' + позиції без ціни' : ''}`);
  }
  for (const w of sel.warnings) out.push(`⚠️ ${esc(w)}`);
  if (client.name || client.phone) out.push(`\n👤 ${esc(client.name || '—')} · ${esc(client.phone || 'немає телефону')}${client.address ? ' · ' + esc(client.address) : ''}`);
  return out.join('\n');
}
