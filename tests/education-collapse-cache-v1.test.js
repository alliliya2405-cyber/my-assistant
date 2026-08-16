'use strict';
const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('styles/education-cards-v1.css?v=4'),'education CSS cache version must be 4');
assert(html.includes('fixes/education-collapse-fix-v1.js?v=5'),'education collapse JS cache version must be 5');
console.log('education collapse cache: ok');
