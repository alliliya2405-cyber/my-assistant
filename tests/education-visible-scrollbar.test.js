'use strict';
const fs=require('fs');
const assert=require('assert');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');
const js=fs.readFileSync('fixes/education-collapse-fix-v1.js','utf8');
const html=fs.readFileSync('index.html','utf8');

assert(css.includes('overflow-y: scroll'),'every education category must expose a native vertical scroll lane');
assert(css.includes('height: clamp(280px, 34vh, 380px)'),'desktop categories need a shared scroll viewport height');
assert(css.includes('::-webkit-scrollbar-thumb'),'native scrollbars must keep the blue thumb style when the browser renders a thumb');
assert(css.includes('scrollbar-color: #8f7cff #eef0f7'),'scrollbars need explicit cross-browser colors');
assert(css.includes('scrollbar-gutter: stable'),'scrollbar space must remain stable as records are added');
assert(!css.includes('.education-category-static-thumb::after'),'do not return to fabricated scrollbar thumbs');
assert(!css.includes('--education-scroll-fill'),'do not fabricate scrollable content');
assert(!js.includes('syncScrollbarIndicator'),'JavaScript must not control scrollbar visuals');
assert(!js.includes('body.scrollHeight>body.clientHeight+1'),'JavaScript must not measure overflow for decoration');
assert(html.includes('styles/education-cards-v1.css?v=9'),'education CSS cache bust must be 9');
assert(html.includes('fixes/education-collapse-fix-v1.js?v=8'),'education collapse JS version must remain 8');
console.log('education native scroll lane in every category: ok');
