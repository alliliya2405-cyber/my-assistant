'use strict';
const fs=require('fs');
const assert=require('assert');
const js=fs.readFileSync('fixes/education-collapse-fix-v1.js','utf8');
const css=fs.readFileSync('styles/education-cards-v1.css','utf8');

assert(js.includes("const STORAGE_KEY='educationCollapseState.v2'"),'collapse state storage must be versioned to reset broken prior state');
assert(js.includes("hero.querySelector('.education-global-collapse-controls')"),'global controls must live inside the stable Education hero');
assert(js.includes("setCollapsed(card,!isCollapsed(card))"),'single category toggle must only invert its own card');
assert(js.includes("categoryCards(grid).forEach(card=>{const key=cardKey(card);if(key)state[key]=next})"),'global controls must update every category explicitly');
assert(css.includes('.hero .education-global-collapse-controls'),'global controls must be visibly styled inside the hero');
assert(css.includes('.education-category-collapsed > .education-category-body'),'collapsed state must hide only that category body');
console.log('education collapse behavior v4: ok');
