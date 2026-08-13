'use strict';
(function(){
  const PEOPLE=['Абдуллина Л.Э.','Исса О.Ф.','Королева С.И.'];
  const content=document.getElementById('content');
  const title=document.getElementById('pageTitle');
  if(!content||!title)return;
  let bypass=false;
  const notify=m=>typeof toast==='function'?toast(m):alert(m);
  const parse=v=>{const m=String(v??'').trim().replace(',','.').match(/^(\d+(?:\.\d+)?)%?$/);return m?Number(m[1]):NaN};
  function latest(owner,period){return (state.reports||[]).filter(d=>d.scope==='personal'&&d.owner===owner&&d.type==='report'&&String(d.period||'').trim()===period).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')))[0]||null}
  function valid(doc){if(!doc||!(doc.rows||[]).length)return false;let total=0;for(const row of doc.rows||[]){const n=parse(row.time);if(!Number.isFinite(n)||n<0||n>100)return false;total+=n}return Math.abs(total-100)<.001}
  function check(period){const missing=[],invalid=[];PEOPLE.forEach(p=>{const d=latest(p,period);if(!d)missing.push(p);else if(!valid(d))invalid.push(p)});return {missing,invalid}}
  content.addEventListener('click',event=>{
    const btn=event.target.closest('[data-integrate-department="report"]');
    if(!btn||title.textContent.trim()!=='Отчёты'||bypass)return;
    const period=prompt('Укажите период для сводного документа «Отчёт дошкольного отдела»',new Date().toISOString().slice(0,7));
    if(period===null){event.preventDefault();event.stopImmediatePropagation();return;}
    const clean=String(period).trim();
    if(!clean){event.preventDefault();event.stopImmediatePropagation();notify('Период обязателен');return;}
    const result=check(clean);
    if(result.missing.length||result.invalid.length){event.preventDefault();event.stopImmediatePropagation();const parts=[];if(result.missing.length)parts.push(`нет отчёта: ${result.missing.join(', ')}`);if(result.invalid.length)parts.push(`время не равно 100%: ${result.invalid.join(', ')}`);notify(`Сводный отчёт не собран. ${parts.join(' · ')}`);return;}
    event.preventDefault();event.stopImmediatePropagation();
    const oldPrompt=window.prompt;window.prompt=()=>clean;bypass=true;
    try{btn.click()}finally{bypass=false;window.prompt=oldPrompt}
  },true);
})();
