'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(!root||typeof document==='undefined')return;
  try{
    const baseRegistry=typeof teamRegistry==='function'?teamRegistry:null;
    if(!baseRegistry)return;
    teamRegistry=function(){
      const rows=baseRegistry();
      const directory=typeof teamMemberDirectory==='function'?teamMemberDirectory():[];
      return api.mergeRegistry(rows,directory);
    };
  }catch(e){console.warn('TeamRegistryIdentityV1 install failed',e)}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const clean=s=>String(s||'').trim();
  const norm=s=>clean(s).toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const toSet=value=>value instanceof Set?new Set(value):new Set(Array.isArray(value)?value:[]);
  const projectKey=row=>`${row?.projectId||''}|${row?.source||''}|${row?.role||''}`;

  function canonicalFor(entry,directory=[]){
    const ids=toSet(entry?.memberIds);
    if(ids.size){
      const byId=directory.filter(person=>person?.id&&ids.has(person.id));
      if(byId.length===1)return byId[0];
    }
    const key=norm(entry?.name);
    if(!key)return null;
    const byName=directory.filter(person=>norm(person?.name)===key);
    return byName.length===1?byName[0]:null;
  }

  function mergeRegistry(entries=[],directory=[]){
    const buckets=new Map();
    (Array.isArray(entries)?entries:[]).forEach(entry=>{
      if(!entry)return;
      const canonical=canonicalFor(entry,directory);
      const memberIds=toSet(entry.memberIds);
      if(canonical?.id)memberIds.add(canonical.id);
      const displayName=clean(canonical?.name)||clean(entry.name)||'Без имени';
      const key=canonical?.id?`id:${canonical.id}`:`name:${norm(displayName)}`;
      if(!buckets.has(key))buckets.set(key,{
        name:displayName,
        memberIds:new Set(),
        contact:'',
        department:'',
        roles:new Set(),
        projects:[],
        statuses:new Set()
      });
      const target=buckets.get(key);
      if(canonical?.name)target.name=clean(canonical.name);
      memberIds.forEach(id=>target.memberIds.add(id));
      toSet(entry.roles).forEach(role=>target.roles.add(role));
      toSet(entry.statuses).forEach(status=>target.statuses.add(status));
      if(!target.contact&&entry.contact)target.contact=entry.contact;
      if(!target.department&&entry.department)target.department=entry.department;
      (Array.isArray(entry.projects)?entry.projects:[]).forEach(row=>{
        const key=projectKey(row);
        if(!target.projects.some(existing=>projectKey(existing)===key))target.projects.push({...row});
      });
    });
    return [...buckets.values()].sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  }

  return {mergeRegistry,canonicalFor};
});
