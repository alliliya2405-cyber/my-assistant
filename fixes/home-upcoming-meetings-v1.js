'use strict';

(() => {
  const content=document.getElementById('content');
  const pageTitle=document.getElementById('pageTitle');
  if(!content||!pageTitle)return;

  const escLocal=value=>typeof esc==='function'?esc(value):String(value||'');
  const fmtLocal=value=>typeof fmt==='function'?fmt(value):String(value||'');

  function renderUpcoming(){
    if(pageTitle.textContent.trim()!=='Главная')return;
    const card=content.querySelector('.home-next-card');
    if(!card)return;
    const today=typeof todayIso==='function'?todayIso():new Date().toISOString().slice(0,10);
    const meetings=(state.meetings||[])
      .filter(m=>m.date&&m.date>=today)
      .slice()
      .sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.time||'99:99').localeCompare(b.time||'99:99'));
    const firstExisting=card.querySelector('.home-meeting');
    const existingNote=card.querySelector('.home-note');
    const oldList=card.querySelector('.home-meeting-list');
    if(oldList)return;
    if(!meetings.length)return;
    if(firstExisting)firstExisting.remove();
    if(existingNote)existingNote.remove();
    const list=document.createElement('div');
    list.className='home-meeting-list';
    list.innerHTML=meetings.map(m=>{
      const projects=(m.projectIds||[]).map(id=>typeof project==='function'?project(id)?.name:'').filter(Boolean);
      return `<div class="home-meeting"><strong title="${escLocal(m.title)}">${escLocal(m.title)}</strong><span>${fmtLocal(m.date)} ${escLocal(m.time||'')}</span>${projects.length?`<small>${projects.map(escLocal).join(' · ')}</small>`:''}</div>`;
    }).join('');
    card.append(list);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderUpcoming()})};
  new MutationObserver(schedule).observe(content,{childList:true,subtree:true});
  new MutationObserver(schedule).observe(pageTitle,{childList:true,subtree:true,characterData:true});
  schedule();
})();
