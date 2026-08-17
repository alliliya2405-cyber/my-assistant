'use strict';
const fs=require('fs');
const assert=require('assert');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');
const html=fs.readFileSync('index.html','utf8');

assert(css.includes('.education-category-expanded > .education-category-body'),'expanded education body must own scrolling');
assert(css.includes('height: clamp(280px, 34vh, 380px)'),'desktop education categories need a consistent scroll viewport');
assert(css.includes('overflow-y: scroll'),'every expanded education category must be a vertical scroll container');
assert(css.includes('scrollbar-gutter: stable'),'education scroll lanes must not shift the card width');
assert(css.includes('height: clamp(260px, 44vh, 360px)'),'mobile education categories need a consistent scroll viewport');
assert(!css.includes('.education-category-static-thumb::after'),'fake scrollbar thumbs must remain removed');
assert(html.includes('styles/education-cards-v1.css?v=9'),'Education scroll CSS cache bust is missing');
console.log('education persistent category scrolling: ok');
