'use strict';

(() => {
  const title=document.getElementById('pageTitle');
  const content=document.getElementById('content');
  const modalRoot=document.getElementById('modalRoot');
  if(!title||!content||!modalRoot)return;

  const parsePercent=value=>{
    const raw=String(value??'').trim().replace(',', '.').replace(/\s+/g,'');
    if(!raw)return {empty:true,valid:true,value:0};
    const match=raw.match(/^(\d+(?:\.\d+)?)%?$/);
    if(!match)return {empty:false,valid:false,value:NaN};
    const n=Number(match[1]);
    return {empty:false,valid:Number.isFinite(n)&&n>=0&&n<=100,value:n};
  };

  function reportType(card){
    return card.querySelector('.report-card-header .chip')?.textContent.trim().toLowerCase()||'';
  }
  function sectionPercentState(section,index){
    const cells=[...section.querySelectorAll('.report-table tbody tr td:nth-child(5)')];
    let total=0,invalid=0,filled=0;
    cells.forEach(cell=>{
      const parsed=parsePercent(cell.textContent);
      if(!parsed.empty)filled++;
      if(!parsed.valid)invalid++;
      else total+=parsed.value;
    });
    const rawName=section.querySelector('h3')?.textContent.trim()||`Сотрудник ${index+1}`;
    const employee=rawName.replace(/^\d+\.\s*/, '');
    total=Math.round(total*100)/100;
    const rows=cells.length;
    return {employee,total,invalid,filled,rows,empty:rows===0,ok:rows>0&&!invalid&&Math.abs(total-100)<0.001};
  }
  function reportPercentState(card){
    const sections=[...card.querySelectorAll('.report-employee')];
    const groups=sections.length?sections.map(sectionPercentState):[sectionPercentState(card,0)];
    const empty=groups.every(g=>g.empty);
    return {groups,empty,ok:!empty&&groups.every(g=>g.ok),invalid:groups.reduce((n,g)=>n+g.invalid,0)};
  }

  function decorateReports(){
    if(title.textContent.trim()!=='Отчёты')return;
    content.querySelectorAll('.report-card').forEach(card=>{
      if(!reportType(card).includes('отчёт'))return;
      const head=card.querySelector('.report-card-header');
      if(!head)return;
      const state=reportPercentState(card);
      const signature=`${state.empty}|`+state.groups.map(g=>`${g.employee}:${g.total}:${g.invalid}:${g.filled}:${g.rows}:${g.empty}:${g.ok}`).join('|');
      let box=card.querySelector(':scope > .report-time-validation');
      if(!box){box=document.createElement('div');box.className='report-time-validation';head.after(box);}
      if(box.dataset.validationSignature===signature)return;
      box.dataset.validationSignature=signature;
      box.classList.toggle('is-valid',state.ok);
      box.classList.toggle('is-error',!state.empty&&!state.ok);
      box.classList.toggle('is-pending',state.empty);
      if(state.empty){
        box.innerHTML='<strong>Документ пока не заполнен</strong><span>Проверка 100% начнётся после добавления первой строки.</span>';
      }else if(state.invalid){
        const bad=state.groups.filter(g=>g.invalid).map(g=>g.employee).join(', ');
        box.innerHTML=`<strong>Ошибка во времени</strong><span>Некорректный процент у: ${bad}. Используйте число от 0 до 100.</span>`;
      }else if(state.ok){
        box.innerHTML=`<strong>Время распределено корректно</strong><span>${state.groups.length===1?'Итого 100%.':`У каждого из ${state.groups.length} сотрудников — 100%.`}</span>`;
      }else{
        const bad=state.groups.filter(g=>!g.empty&&!g.ok);
        box.innerHTML=`<strong>Ошибка распределения времени</strong><span>${bad.map(g=>`${g.employee}: ${g.total}% (${g.total<100?`не хватает ${Math.round((100-g.total)*100)/100}%`:`лишних ${Math.round((g.total-100)*100)/100}%`})`).join(' · ')}</span>`;
      }
      card.dataset.reportTimeValid=state.empty?'pending':(state.ok?'true':'false');
    });
  }

  function findTimeField(modal){
    const fields=[...modal.querySelectorAll('.field')];
    const field=fields.find(el=>el.querySelector('label')?.textContent.trim()==='Время');
    if(!field)return null;
    return {field,input:field.querySelector('input,textarea')};
  }
  function decorateModal(){
    const modal=modalRoot.querySelector('.modal');
    if(!modal)return;
    const heading=modal.querySelector('.modal-header h2')?.textContent.trim()||'';
    if(!/^(Изменить строку|Добавить строку)$/.test(heading))return;
    const found=findTimeField(modal);
    if(!found?.input||found.input.dataset.percentValidationReady)return;
    const {field,input}=found;
    input.dataset.percentValidationReady='1';input.setAttribute('inputmode','decimal');input.setAttribute('aria-describedby','reportTimeFieldHint');
    let hint=field.querySelector('.report-time-field-hint');
    if(!hint){hint=document.createElement('div');hint.id='reportTimeFieldHint';hint.className='report-time-field-hint';field.append(hint);}
    const validate=()=>{
      const parsed=parsePercent(input.value),invalid=!parsed.valid;
      field.classList.toggle('report-time-field-error',invalid);input.setAttribute('aria-invalid',String(invalid));
      const next=invalid?'Ошибка: укажите число от 0 до 100, например 15%.':'Укажите долю рабочего времени от 0 до 100%.';
      if(hint.textContent!==next)hint.textContent=next;
      return !invalid;
    };
    input.addEventListener('input',validate);input.addEventListener('blur',validate);validate();
    const save=modal.querySelector('.modal-footer .btn.primary');
    if(save&&!save.dataset.percentValidationReady){save.dataset.percentValidationReady='1';save.addEventListener('click',event=>{if(validate())return;event.preventDefault();event.stopImmediatePropagation();input.focus();},true);}
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorateReports();decorateModal();})};
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(modalRoot,{childList:true,subtree:true});
  schedule();
})();
