const fs=require('fs');
const js=fs.readFileSync('fixes/reports-single-personal-document-v1.js','utf8');
if(!js.includes("const key=d=>`${d.owner}::${d.type}::${String(d.period||'').trim()}`"))throw new Error('document identity key missing');
if(!js.includes('mergeRows(group,canonical)'))throw new Error('duplicate rows are not merged');
if(!js.includes('sourceReportIds'))throw new Error('department source references are not repaired');
if(!js.includes('уже существует — открываю существующий документ'))throw new Error('repeat creation guard missing');
console.log('reports-single-personal-document-v1 ok');
