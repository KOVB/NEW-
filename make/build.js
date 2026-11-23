// Збирає код для Make-модуля «Run code» з lib/* + make/handler.js → make/bot-code.js
import { readFileSync, writeFileSync } from 'node:fs';
const strip = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace(/^export (const|function|async function) /gm, '$1 ');
const parts = [
  '// ЗГЕНЕРОВАНО make/build.js — не редагувати вручну, правити lib/* та make/handler.js',
  strip('lib/catalog.js'), strip('lib/selector.js'), strip('lib/parser.js'),
  // з keycrm.js беремо лише buildManagerComment
  strip('lib/keycrm.js').match(/function buildManagerComment[\s\S]*?\n}\n/)[0],
  readFileSync(new URL('./handler.js', import.meta.url), 'utf8'),
];
writeFileSync(new URL('./bot-code.js', import.meta.url), parts.join('\n'));
console.log('make/bot-code.js', parts.join('\n').length, 'chars');
