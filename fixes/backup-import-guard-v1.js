'use strict';

(function () {
  const input=document.querySelector('#importInput');
  if(!input)return;

  function isAssistantBackup(value){
    if(!value||typeof value!=='object'||Array.isArray(value))return false;
    if(!Array.isArray(value.projects)||!Array.isArray(value.tasks))return false;
    if(!value.settings||typeof value.settings!=='object'||Array.isArray(value.settings))return false;
    const collectionKeys=['assignments','meetings','notes','library','reflections','health','leisure','quotes','reports','boards','history'];
    return collectionKeys.every(key=>value[key]===undefined||Array.isArray(value[key]));
  }

  input.onchange=e=>{
    const f=e.target.files[0];
    if(!f)return;
    if(f.size>20*1024*1024){toast('Файл слишком большой');e.target.value='';return}
    const r=new FileReader();
    r.onload=()=>{
      try{
        const parsed=JSON.parse(r.result);
        if(!isAssistantBackup(parsed)){
          toast('Это не резервная копия «Моего ассистента». Данные не изменены.');
          return;
        }
        localStorage.setItem(STORAGE_KEY+'.beforeImport',JSON.stringify(state));
        state=normalize(parsed);
        if(!persist('Резервная копия импортирована'))throw new Error('storage');
        render();
      }catch(err){
        console.error(err);
        const backup=localStorage.getItem(STORAGE_KEY+'.beforeImport');
        if(backup){try{state=normalize(JSON.parse(backup))}catch{}}
        toast('Не удалось импортировать файл: структура повреждена или хранилище недоступно');
      }finally{
        e.target.value='';
      }
    };
    r.onerror=()=>{toast('Не удалось прочитать файл');e.target.value=''};
    r.readAsText(f);
  };
})();
