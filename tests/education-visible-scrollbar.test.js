'use strict';
const fs=require('fs');
const assert=require('assert');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');
const js=fs.readFileSync('fixes/education-collapse-fix-v1.js','utf8');
const html=fs.readFileSync('index.html','utf8');

assert(css.includes('overflow-y: auto'),'education categories must use native overflow only when needed');
assert(css.includes('max-height: clamp(320px, 43vh, 500px)'),'desktop categories need a maximum scroll height');
assert(css.includes('::-webkit-scrollbar-thumb'),'real overflow scrollbars may keep a consistent thumb style');
assert(css.includes('scrollbar-color: #8f7cff #eef0f7'),'real overflow scrollbars need explicit cross-browser colors');
assert(!css.includes('.education-category-static-thumb::after'),'non-overflow categories must not draw a fake thumb');
assert(!css.includes('--education-scroll-fill'),'non-overflow categories must not fabricate scrollable content');
assert(!js.includes('syncScrollbarIndicator'),'JavaScript must not control scrollbar visuals');
assert(!js.includes('body.scrollHeight>body.clientHeight+1'),'JavaScript must not measure overflow for decoration');
assert(html.includes('styles/education-cards-v1.css?v=8'),'education CSS cache bust must be 8');
assert(html.includes('fixes/education-collapse-fix-v1.js?v=8'),'education collapse JS cache bust must be 8');
console.log('education natural scrollbar behavior: ok');
