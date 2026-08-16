'use strict';
const fs=require('fs');
const assert=require('assert');
const js=fs.readFileSync('fixes/education-collapse-fix-v1.js','utf8');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');
const html=fs.readFileSync('index.html','utf8');

assert(js.includes("dataEducationCategoryToggle")||js.includes('educationCategoryToggle')||js.includes('data-education-category-toggle'),'per-category toggle is missing');
assert(js.includes("toggle.textContent=isCollapsed?'Развернуть':'Свернуть'"),'toggle label does not track state');
assert(js.includes('data-education-collapse-all'),'collapse-all control is missing');
assert(js.includes('data-education-expand-all'),'expand-all control is missing');
assert(js.includes("part.hidden=isCollapsed"),'category body is not actually hidden');
assert(!js.includes("text === 'Свернуть все' || text === 'Развернуть все'"),'old logic still removes collapse controls');
assert(css.includes('max-height: 640px'),'expanded categories must have bounded height');
assert(css.includes('overflow-y: auto'),'expanded categories must scroll internally');
assert(css.includes('.education-category-collapsed'),'collapsed category styling is missing');
assert(html.includes('styles/education-cards-v1.css?v=2'),'Education CSS cache bust is missing');
assert(html.includes('fixes/education-collapse-fix-v1.js?v=2'),'Education collapse JS cache bust is missing');
console.log('education category collapse v2: ok');
