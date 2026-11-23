// Перевірка доступу до KeyCRM і список джерел замовлень: KEYCRM_API_KEY=... node scripts/keycrm-sources.js
import { keycrm } from '../lib/keycrm.js';
const sources = await keycrm.call('/order/source?limit=50');
console.log('Джерела замовлень (KEYCRM_SOURCE_ID):');
for (const s of sources.data || []) console.log(`  ${s.id}\t${s.name}`);
