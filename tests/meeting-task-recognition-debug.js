'use strict';
const core=require('../fixes/meeting-task-recognition-v2.js');
const api=require('../fixes/meeting-task-recognition-v2-cleanup.js');
const people=[
  {id:'a',name:'Абдуллина Л.Э.',projectIds:['p1','p3']},
  {id:'i',name:'Исса О.Ф.',projectIds:['p2']},
  {id:'k',name:'Королева С.И.',projectIds:['p1','p2']}
];
const projects=[{id:'p1',name:'Методическая школа 2.0'},{id:'p2',name:'Обучение педагогов'},{id:'p3',name:'Числумики'}];
const meeting={date:'2026-08-11',projectIds:['p1'],actionItems:'Исса О.Ф. | Отправить письмо участникам | 2026-08-14 | Обучение педагогов'};
console.log('match',core.matchPerson('Исса О.Ф.',people));
console.log('strip',core.stripPerson('Отправить письмо участникам','Исса О.Ф.'));
console.log('core rows',JSON.stringify(core.extractMeetingTaskCandidates(meeting,{people,projects})));
console.log('cleanup rows',JSON.stringify(api.extractMeetingTaskCandidates(meeting,{people,projects})));
