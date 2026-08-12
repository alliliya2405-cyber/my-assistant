/* Personal reports for preschool staff and integrated department documents. */
(function(){
  'use strict';
  const PEOPLE=['Абдуллина Л.Э.','Исса О.Ф.','Королева С.И.'];
  const titleEl=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  if(!titleEl||!content)return;

  const escHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const typeLabel=t=>t==='plan'?'План':'Отчёт';
  const defaultTitle=(type,owner,period)=>`${type==='plan'?'ПЛАН':'ОТЧЁТ'} ${owner.toUpperCase()} ${type==='plan'?'НА':'ЗА'} ${period||'НОВЫЙ ПЕРИОД'}`;
  const departmentTitle=(type,period)=>`${type==='plan'?'ПЛАН':'ОТЧЁТ'} ДОШКОЛЬНОГО ОТДЕЛА ${type==='plan'?'НА':'ЗА'} ${period||'НОВЫЙ ПЕРИОД'}`;
  const now=()=>typeof nowStamp==='function'?nowStamp():new Date().toISOString();
  const newId=()=>typeof uid==='function'?uid():`id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const notify=msg=>typeof toast==='function'?toast(msg):alert(msg);

  function normalizeLegacy(){
    (state.reports||[]).forEach(doc=>{
      if(doc.scope)return;
      doc.scope='department';
      doc.owner='Дошкольный отдел';
      doc.source=doc.source||'legacy';
    });
  }

  function createPersonal(owner,type,source='manual'){
    const period=prompt(`Укажите период для документа «${typeLabel(type)} — ${owner}»`,new Date().toISOString().slice(0,7));
    if(period===null)return null;
    const clean=String(period).trim();
    if(!clean){notify('Период обязателен');return null;}
    const doc={id:newId(),type,scope:'personal',owner,source,title:defaultTitle(type,owner,clean),department:'Дошкольный отдел',period:clean,rows:[],createdAt:now(),updatedAt:now()};
    state.reports.unshift(doc);persist(`Создан персональный ${type==='plan'?'план':'отчёт'}: ${owner}`);render();
    return doc;
  }

  function createManual(owner,type){
    const doc=createPersonal(owner,type,'manual');
    if(!doc)return;
    setTimeout(()=>{if(typeof openReportRow==='function')openReportRow(doc)},0);
  }

  function createAuto(owner,type){
    const doc=createPersonal(owner,type,'auto');
    if(!doc)return;
    setTimeout(()=>{if(typeof collectReportData==='function')collectReportData(doc)},0);
  }

  function splitCsvLine(line,delimiter){
    const out=[];let cur='',quote=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(quote&&line[i+1]==='"'){cur+='"';i++;}
        else quote=!quote;
      }else if(ch===delimiter&&!quote){out.push(cur.trim());cur='';}
      else cur+=ch;
    }
    out.push(cur.trim());return out;
  }
  function detectDelimiter(line){
    const variants=[';','\t',','];
    return variants.sort((a,b)=>(line.split(b).length-line.split(a).length))[0];
  }
  function keyName(v){
    const s=String(v||'').trim().toLowerCase();
    if(['сотрудник','employee','фио'].includes(s))return'employee';
    if(['проект','project'].includes(s))return'project';
    if(['вид деятельности','деятельность','activity'].includes(s))return'activity';
    if(['план','plan','план (начало месяца)'].includes(s))return'plan';
    if(['результат','result','результат (конец месяца)'].includes(s))return'result';
    if(['время','time','процент','%'].includes(s))return'time';
    return'';
  }
  function parseCsv(text,owner){
    const lines=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).filter(x=>x.trim());
    if(lines.length<2)throw new Error('CSV должен содержать заголовок и хотя бы одну строку');
    const delimiter=detectDelimiter(lines[0]);
    const headers=splitCsvLine(lines[0],delimiter).map(keyName);
    if(!headers.includes('project')&&!headers.includes('plan'))throw new Error('Не найдены колонки «Проект» или «План»');
    return lines.slice(1).map(line=>{
      const vals=splitCsvLine(line,delimiter),row={id:newId(),employee:owner,project:'',activity:'',plan:'',result:'',time:''};
      headers.forEach((key,i)=>{if(key&&key!=='employee')row[key]=vals[i]||''});
      return row;
    }).filter(r=>r.project||r.activity||r.plan||r.result||r.time);
  }
  function parseJson(text,owner){
    const parsed=JSON.parse(text);const rows=Array.isArray(parsed)?parsed:parsed.rows;
    if(!Array.isArray(rows))throw new Error('JSON должен содержать массив строк или поле rows');
    return rows.map(r=>({id:newId(),employee:owner,project:String(r.project||r['Проект']||''),activity:String(r.activity||r['Вид деятельности']||''),plan:String(r.plan||r['План']||''),result:String(r.result||r['Результат']||''),time:String(r.time||r['Время']||'')}));
  }
  function importFile(owner,type,file){
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const text=String(reader.result||'');
        const rows=file.name.toLowerCase().endsWith('.json')?parseJson(text,owner):parseCsv(text,owner);
        if(!rows.length)throw new Error('В файле нет строк документа');
        const suggested=new Date().toISOString().slice(0,7);
        const period=prompt(`Период загружаемого документа «${typeLabel(type)} — ${owner}»`,suggested);
        if(period===null)return;
        const clean=String(period).trim();if(!clean)throw new Error('Период обязателен');
        const doc={id:newId(),type,scope:'personal',owner,source:'import',importFileName:file.name,title:defaultTitle(type,owner,clean),department:'Дошкольный отдел',period:clean,rows,createdAt:now(),updatedAt:now()};
        state.reports.unshift(doc);persist(`Загружен ${type==='plan'?'план':'отчёт'}: ${owner}`);render();
      }catch(err){notify(`Не удалось загрузить документ: ${err.message||err}`)}
    };
    reader.readAsText(file,'utf-8');
  }

  function personalDoc(owner,type,period){
    return (state.reports||[]).filter(d=>d.scope==='personal'&&d.owner===owner&&d.type===type&&String(d.period||'').trim()===period).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')))[0]||null;
  }
  function integrateDepartment(type){
    const period=prompt(`Укажите период для сводного документа «${typeLabel(type)} дошкольного отдела»`,new Date().toISOString().slice(0,7));
    if(period===null)return;
    const clean=String(period).trim();if(!clean){notify('Период обязателен');return;}
    const docs=PEOPLE.map(owner=>personalDoc(owner,type,clean));
    const missing=PEOPLE.filter((_,i)=>!docs[i]);
    if(missing.length){notify(`Не хватает персональных документов за ${clean}: ${missing.join(', ')}`);return;}
    const rows=[];
    docs.forEach((doc,i)=>{
      const owner=PEOPLE[i];
      (doc.rows||[]).forEach(r=>rows.push({id:newId(),employee:owner,project:r.project||'',activity:r.activity||'',plan:r.plan||'',result:type==='report'?(r.result||''):'',time:r.time||'',sourceReportId:doc.id}));
    });
    let target=(state.reports||[]).find(d=>d.scope==='department'&&d.type===type&&String(d.period||'').trim()===clean);
    if(target){target.rows=rows;target.title=departmentTitle(type,clean);target.owner='Дошкольный отдел';target.source='integrated';target.sourceReportIds=docs.map(d=>d.id);target.updatedAt=now();}
    else{target={id:newId(),type,scope:'department',owner:'Дошкольный отдел',source:'integrated',sourceReportIds:docs.map(d=>d.id),title:departmentTitle(type,clean),department:'Дошкольный отдел',period:clean,rows,createdAt:now(),updatedAt:now()};state.reports.unshift(target);}
    persist(`Собран сводный ${type==='plan'?'план':'отчёт'} дошкольного отдела`);render();
  }

  function docId(card,index){
    const btn=card.querySelector('[data-edit-report],[data-add-report-row],[data-collect-report],[data-export-report],[data-delete-report]');
    return btn?.dataset.editReport||btn?.dataset.addReportRow||btn?.dataset.collectReport||btn?.dataset.exportReport||btn?.dataset.deleteReport||state.reports?.[index]?.id||'';
  }
  function decorateCards(){
    const cards=[...content.querySelectorAll('.reports-list .report-card')];
    cards.forEach((card,index)=>{
      const id=docId(card,index),doc=(state.reports||[]).find(d=>d.id===id)||state.reports?.[index];
      if(!doc)return;
      const head=card.querySelector('.report-card-header>div:first-child');if(!head)return;
      let meta=head.querySelector('.report-doc-origin');
      if(!meta){meta=document.createElement('div');meta.className='report-doc-origin';head.append(meta);}
      if(doc.scope==='personal')meta.innerHTML=`<span class="chip">Персональный</span><b>${escHtml(doc.owner)}</b><span>${doc.source==='import'?'Загружен из файла':doc.source==='auto'?'Автосборка':'Ручное заполнение'}</span>`;
      else meta.innerHTML='<span class="chip">Сводный</span><b>Дошкольный отдел</b><span>Интеграция персональных документов</span>';
    });
  }

  function decorate(){
    if(titleEl.textContent.trim()!=='Отчёты')return;
    normalizeLegacy();
    const command=content.querySelector('.report-command-center');
    if(command&&!content.querySelector('.personal-report-workflow')){
      const section=document.createElement('section');section.className='card personal-report-workflow';
      section.innerHTML=`<div class="report-flow-head"><div><p class="eyebrow">Персональные документы → сводный документ</p><h2>Отчёты и планы сотрудников</h2><p>Абдуллина заполняет документ вручную или собирает из приложения. Исса и Королева загружают готовые документы. Сводный документ отдела формируется из трёх персональных.</p></div></div><div class="personal-report-grid"><article><h3>Абдуллина Л.Э.</h3><div class="report-flow-actions"><button class="btn ghost" data-personal-manual="report">Отчёт вручную</button><button class="btn ghost" data-personal-manual="plan">План вручную</button><button class="btn primary" data-personal-auto="report">Собрать отчёт</button><button class="btn primary" data-personal-auto="plan">Собрать план</button></div></article><article><h3>Исса О.Ф.</h3><div class="report-flow-actions"><label class="btn ghost file-btn">Загрузить отчёт<input hidden type="file" accept=".csv,.json,text/csv,application/json" data-personal-import="report" data-owner="Исса О.Ф."></label><label class="btn ghost file-btn">Загрузить план<input hidden type="file" accept=".csv,.json,text/csv,application/json" data-personal-import="plan" data-owner="Исса О.Ф."></label></div><small>CSV или JSON</small></article><article><h3>Королева С.И.</h3><div class="report-flow-actions"><label class="btn ghost file-btn">Загрузить отчёт<input hidden type="file" accept=".csv,.json,text/csv,application/json" data-personal-import="report" data-owner="Королева С.И."></label><label class="btn ghost file-btn">Загрузить план<input hidden type="file" accept=".csv,.json,text/csv,application/json" data-personal-import="plan" data-owner="Королева С.И."></label></div><small>CSV или JSON</small></article></div><div class="department-integrate"><div><h3>Дошкольный отдел</h3><p>Собирается только из персональных документов Абдуллиной, Иссы и Королевой за один период.</p></div><div class="actions"><button class="btn primary" data-integrate-department="report">Собрать отчёт отдела</button><button class="btn primary" data-integrate-department="plan">Собрать план отдела</button></div></div>`;
      command.before(section);
      section.querySelectorAll('[data-personal-manual]').forEach(b=>b.onclick=()=>createManual('Абдуллина Л.Э.',b.dataset.personalManual));
      section.querySelectorAll('[data-personal-auto]').forEach(b=>b.onclick=()=>createAuto('Абдуллина Л.Э.',b.dataset.personalAuto));
      section.querySelectorAll('[data-personal-import]').forEach(input=>input.onchange=()=>{const file=input.files?.[0];if(file)importFile(input.dataset.owner,input.dataset.personalImport,file);input.value=''});
      section.querySelectorAll('[data-integrate-department]').forEach(b=>b.onclick=()=>integrateDepartment(b.dataset.integrateDepartment));
    }
    decorateCards();
  }

  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(schedule).observe(titleEl,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  schedule();
})();
