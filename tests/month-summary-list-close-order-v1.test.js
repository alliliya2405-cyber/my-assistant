'use strict';
const fs=require('fs');
const assert=require('assert');
const js=fs.readFileSync('fixes/month-summary-list-v1.js','utf8');
assert(js.indexOf("const close=event.target.closest('[data-month-list-close]')")<js.indexOf("const filter=event.target.closest('.month-workspace [data-month-filter]')"),'close handler should run before month filter handler');
assert(js.includes("close.closest('[data-month-summary-list]')?.remove()"),'close must remove the list immediately');
console.log('month summary list close order: ok');
