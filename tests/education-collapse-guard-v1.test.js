'use strict';
const fs=require('fs');
const assert=require('assert');
const js=fs.readFileSync('fixes/education-collapse-fix-v1.js','utf8');
assert(js.includes('function educationHero()'),'Education hero resolver is missing');
assert(js.includes('hero.appendChild(bar)'),'Global collapse controls must be anchored inside the Education hero');
assert(js.includes('body.hidden=collapsed'),'Native hidden flag must match per-card state');
assert(js.includes('educationCollapseState.v2'),'Broken previous session state must not leak into the fixed behavior');
console.log('education collapse guard: ok');
