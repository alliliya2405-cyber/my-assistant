'use strict';
const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('fixes/month-summary-list-v1.js?v=5'),'month summary close/range fix cache version is not loaded');
console.log('month summary list close cache: ok');
