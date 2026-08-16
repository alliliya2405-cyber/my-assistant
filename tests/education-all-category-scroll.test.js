'use strict';
const fs=require('fs');
const assert=require('assert');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');
const html=fs.readFileSync('index.html','utf8');

assert(css.includes('.education-category-expanded > .education-category-body'),'expanded education body must own scrolling');
assert(css.includes('height: clamp(320px, 43vh, 500px)'),'desktop education category bodies need a bounded uniform height');
assert(css.includes('overflow-y: scroll'),'every expanded education category must expose internal vertical scrolling');
assert(css.includes('scrollbar-gutter: stable'),'education scrollbars must not shift card width');
assert(css.includes('height: clamp(300px, 52vh, 440px)'),'mobile education category bodies need bounded scrolling too');
assert(css.includes('::-webkit-scrollbar-thumb'),'education categories need a visible native thumb style');
assert(css.includes('.education-category-static-thumb::after'),'short categories need a deterministic visual thumb');
assert(html.includes('styles/education-cards-v1.css?v=7'),'Education scroll CSS cache bust is missing');
console.log('education all-category internal scrolling: ok');
