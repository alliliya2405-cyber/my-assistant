'use strict';
const assert=require('assert');
const fs=require('fs');
const css=fs.readFileSync('styles/reports-workflow-v1.css','utf8');
assert(css.includes('max-height:none!important'),'Report tables must not be capped by an internal vertical viewport');
assert(css.includes('overflow-y:visible!important'),'Report tables must expand vertically with the page');
assert(css.includes('overflow-x:auto!important'),'Horizontal scrolling must remain available for wide tables');
assert(/\.report-table\{[^}]*width:100%;[^}]*min-width:980px/.test(css),'Report table must preserve readable column widths');
console.log('reports document readability: ok');
