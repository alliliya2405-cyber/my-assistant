'use strict';
const fs=require('fs');
const assert=require('assert');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');
const html=fs.readFileSync('index.html','utf8');

assert(css.includes('.education-category-expanded > .education-category-body'),'expanded education body must own scrolling');
assert(css.includes('max-height: clamp(320px, 43vh, 500px)'),'desktop education category bodies need a bounded maximum height');
assert(css.includes('overflow-y: auto'),'education categories must scroll only when content exceeds the maximum height');
assert(!/(^|\n)\s*height:\s*clamp\(320px,\s*43vh,\s*500px\)/.test(css),'short categories must not be forced to the maximum height');
assert(!css.includes('overflow-y: scroll'),'short categories must not be forced to show a scrollbar');
assert(!css.includes('.education-category-static-thumb::after'),'fake scrollbar thumbs must not be rendered');
assert(css.includes('max-height: clamp(300px, 52vh, 440px)'),'mobile education category bodies need a bounded maximum height too');
assert(html.includes('styles/education-cards-v1.css?v=8'),'Education scroll CSS cache bust is missing');
console.log('education natural internal scrolling: ok');
