'use strict';
const assert=require('assert');
const api=require('../fixes/team-registry-identity-v1.js');

const directory=[{id:'short-i',name:'Исса О.Ф.',projectIds:['p2']}];
const entries=[
  {
    name:'О.Ф.',
    memberIds:new Set(['short-i']),
    contact:'',department:'Дошкольный отдел',
    roles:new Set(['Координатор']),statuses:new Set(['active']),
    projects:[{projectId:'p2',project:'Обучение педагогов',source:'Проект',role:'Координатор',status:'active'}]
  },
  {
    name:'Исса О.Ф.',
    memberIds:new Set(['short-i']),
    contact:'',department:'Дошкольный отдел',
    roles:new Set(),statuses:new Set(['assigned']),
    projects:[{projectId:'p2',project:'Обучение педагогов',source:'Поручение',role:'Исполнитель',status:'assigned'}]
  }
];
let rows=api.mergeRegistry(entries,directory);
assert.equal(rows.length,1,'Короткое и полное имя с одним memberId должны объединяться в одну карточку');
assert.equal(rows[0].name,'Исса О.Ф.','В карточке должно отображаться полное имя из канонического справочника');
assert(rows[0].memberIds.has('short-i'));
assert.equal(rows[0].projects.length,2,'Участие в проекте и поручение должны сохраниться');
assert(rows[0].projects.some(x=>x.source==='Проект'));
assert(rows[0].projects.some(x=>x.source==='Поручение'));
assert(rows[0].statuses.has('active')&&rows[0].statuses.has('assigned'));

rows=api.mergeRegistry([
  {name:'О.Ф.',memberIds:new Set(['person-1']),roles:new Set(),statuses:new Set(),projects:[]},
  {name:'О.Ф.',memberIds:new Set(['person-2']),roles:new Set(),statuses:new Set(),projects:[]}
],[
  {id:'person-1',name:'Исса О.Ф.'},
  {id:'person-2',name:'Иванова О.Ф.'}
]);
assert.equal(rows.length,2,'Разные memberId нельзя объединять только из-за одинаковых инициалов');
assert.deepEqual(rows.map(x=>x.name).sort(),['Иванова О.Ф.','Исса О.Ф.'].sort());

rows=api.mergeRegistry([
  {name:'Исса О.Ф.',memberIds:new Set(['short-i']),roles:new Set(),statuses:new Set(),projects:[{projectId:'p2',source:'Поручение',role:'Исполнитель'}]},
  {name:'Исса О.Ф.',memberIds:new Set(['short-i']),roles:new Set(),statuses:new Set(),projects:[{projectId:'p2',source:'Поручение',role:'Исполнитель'}]}
],directory);
assert.equal(rows[0].projects.length,1,'Одинаковые строки проекта/источника/роли не должны дублироваться');

console.log('team-registry-identity-v1: 3 scenarios passed');
