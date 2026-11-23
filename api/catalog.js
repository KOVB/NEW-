// GET /api/catalog — каталог для ручного додавання позицій у Mini App.
import { CATALOG } from '../lib/catalog.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json(CATALOG.map(({ sku, name, unit, price }) => ({ sku, name, unit, price })));
}
