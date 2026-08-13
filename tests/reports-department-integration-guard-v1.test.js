'use strict';
const assert=require('assert');
const fs=require('fs');
const js=fs.readFileSync('fixes/reports-department-integration-guard-v1.js','utf8');
assert(js.includes("PEOPLE=['Абдуллина Л.Э.','Исса О.Ф.','Королева С.И.']"),'Guard must validate all three preschool employees');
assert(js.includes("Math.abs(total-100)<.001"),'Personal report time must total 100%');
assert(js.includes('result.missing.length||result.invalid.length'),'Integration must stop for missing or invalid personal reports');
assert(js.includes('bypass=true'),'Re-dispatched valid integration click must bypass the guard once');
console.log('reports department integration guard: ok');
