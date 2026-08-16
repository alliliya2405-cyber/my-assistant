'use strict';
const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('styles/education-cards-v1.css?v=6'),'education CSS cache version must be 6');
assert(html.includes('fixes/education-collapse-fix-v1.js?v=6'),'education collapse JS cache version must be 6');
console.log('education collapse cache: ok');
