'use strict';
const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('styles/education-cards-v1.css?v=7'),'education CSS cache version must be 7');
assert(html.includes('fixes/education-collapse-fix-v1.js?v=7'),'education collapse JS cache version must be 7');
console.log('education collapse cache: ok');
