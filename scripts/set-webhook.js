// Використання: TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... node scripts/set-webhook.js https://<домен>
const base = (process.argv[2] || process.env.WEBAPP_URL || '').replace(/\/$/, '');
if (!base) { console.error('Вкажіть URL: node scripts/set-webhook.js https://your-app.vercel.app'); process.exit(1); }
const api = (m, p) => fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${m}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p),
}).then((r) => r.json());

console.log('setWebhook', await api('setWebhook', {
  url: `${base}/api/telegram`,
  secret_token: process.env.TELEGRAM_WEBHOOK_SECRET || undefined,
  allowed_updates: ['message', 'callback_query'],
  drop_pending_updates: true,
}));
console.log('setChatMenuButton', await api('setChatMenuButton', {
  menu_button: { type: 'web_app', text: 'Підбір системи', web_app: { url: `${base}/` } },
}));
console.log('setMyCommands', await api('setMyCommands', { commands: [{ command: 'start', description: 'Інструкція та форма підбору' }] }));
