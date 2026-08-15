'use strict';
const fs=require('fs');
const assert=require('assert');
const audit=fs.readFileSync('fixes/reports-audit-template-v1.js','utf8');
const imports=fs.readFileSync('fixes/reports-import-validation-v1.js','utf8');

assert(audit.includes("if(doc.type!=='report'||!rows.length)return {pending:doc.type==='report'&&!rows.length,valid:true,total:0}"),'empty report drafts must be pending, not audit errors');
assert(audit.includes("Сводный отчёт ${d.period}: некорректное время"),'audit must verify integrated report source totals');
assert(imports.includes("function existing(owner,type,period)"),'import must find existing personal document');
assert(imports.includes("doc.previousVersions=[...(doc.previousVersions||[]),snapshot(doc)].slice(-5)"),'re-import must preserve previous version');
assert(imports.includes("doc.rows=rows;doc.source='import'"),'re-import must update the existing document instead of appending a duplicate');
console.log('reports audit stabilization regression checks: OK');
