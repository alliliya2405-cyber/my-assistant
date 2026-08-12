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

  function reportPercentState(card){
    const cells=[...card.querySelectorAll('.report-table tbody tr td:nth-child(5)')];
    let total=0,invalid=0,filled=0;
    cells.forEach(cell=>{
      const parsed=parsePercent(cell.textContent);
      if(!parsed.empty)filled++;
      if(!parsed.valid)invalid++;
      else total+=parsed.value;
    });
    return {total:Math.round(total*100)/100,invalid,filled,rows:cells.length};
  }

  function decorateReports(){
    if(title.textContent.trim()!=='Отчёты')return;
    content.querySelectorAll('.report-card').forEach(card=>{
      if(!reportType(card).includes('отчёт'))return;
      const head=card.querySelector('.report-card-header');
      if(!head)return;
      const state=reportPercentState(card);
      const ok=!state.invalid&&Math.abs(state.total-100)<0.001;
      const signature=`${state.total}|${state.invalid}|${state.filled}|${state.rows}|${ok}`;
      let box=card.querySelector(':scope > .report-time-validation');
      if(!box){
        box=document.createElement('div');
        box.className='report-time-validation';
        head.after(box);
      }
      if(box.dataset.validationSignature===signature)return;
      box.dataset.validationSignature=signature;
      box.classList.toggle('is-valid',ok);
      box.classList.toggle('is-error',!ok);
      if(state.invalid){
        box.innerHTML='<strong>Ошибка во времени</strong><span>В одной или нескольких строках указан некорректный процент. Используйте число от 0 до 100.</span>';
      }else if(ok){
        box.innerHTML='<strong>Время: 100%</strong><span>Распределение времени заполнено корректно.</span>';
      }else{
        const delta=Math.round(Math.abs(100-state.total)*100)/100;
        box.innerHTML=`<strong>Ошибка: всего ${state.total}% вместо 100%</strong><span>${state.total<100?'Не хватает':'Лишних'} ${delta}%. Исправьте значения в колонке «Время».</span>`;
      }
      card.dataset.reportTimeValid=ok?'true':'false';
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
    input.dataset.percentValidationReady='1';
    input.setAttribute('inputmode','decimal');
    input.setAttribute('aria-describedby','reportTimeFieldHint');
    let hint=field.querySelector('.report-time-field-hint');
    if(!hint){
      hint=document.createElement('div');
      hint.id='reportTimeFieldHint';
      hint.className='report-time-field-hint';
      field.append(hint);
    }
    const validate=()=>{
      const parsed=parsePercent(input.value);
      const invalid=!parsed.valid;
      field.classList.toggle('report-time-field-error',invalid);
      input.setAttribute('aria-invalid',String(invalid));
      const next=invalid?'Ошибка: укажите число от 0 до 100, например 15%.':'Укажите долю рабочего времени от 0 до 100%.';
      if(hint.textContent!==next)hint.textContent=next;
      return !invalid;
    };
    input.addEventListener('input',validate);
    input.addEventListener('blur',validate);
    validate();
    const save=modal.querySelector('.modal-footer .btn.primary');
    if(save&&!save.dataset.percentValidationReady){
      save.dataset.percentValidationReady='1';
      save.addEventListener('click',event=>{
        if(validate())return;
        event.preventDefault();
        event.stopImmediatePropagation();
        input.focus();
      },true);
    }
  }

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      decorateReports();
      decorateModal();
    });
  };
  new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(modalRoot,{childList:true,subtree:true});
  schedule();
})();
