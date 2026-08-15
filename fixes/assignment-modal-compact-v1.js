'use strict';

(() => {
  const root=document.getElementById('modalRoot');
  if(!root)return;

  function markAssignmentModal(){
    const modal=root.querySelector('.modal');
    if(!modal)return;
    const title=modal.querySelector('#modalTitle,.modal-header h2')?.textContent?.trim()||'';
    const isAssignment=title==='Новое поручение'||title==='Редактировать поручение';
    modal.classList.toggle('assignment-modal-compact',isAssignment);
  }

  new MutationObserver(markAssignmentModal).observe(root,{childList:true,subtree:true});
  markAssignmentModal();
})();
