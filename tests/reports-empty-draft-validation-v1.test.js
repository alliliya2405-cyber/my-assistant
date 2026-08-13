const fs=require('fs');
const js=fs.readFileSync('fixes/reports-time-validation-v1.js','utf8');
if(!js.includes("empty:rows===0"))throw new Error('empty rows must be detected');
if(!js.includes("Документ пока не заполнен"))throw new Error('pending message missing');
if(!js.includes("reportTimeValid=state.empty?'pending'"))throw new Error('pending state missing');
if(!js.includes("box.classList.toggle('is-error',!state.empty&&!state.ok)"))throw new Error('empty drafts must not be errors');
console.log('reports-empty-draft-validation-v1 ok');
