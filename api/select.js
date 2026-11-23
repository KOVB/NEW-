// POST /api/select — підбір системи для Mini App (без секретів, лише розрахунок).
import { selectSystem } from '../lib/selector.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    return res.status(200).json(selectSystem(req.body || {}));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
