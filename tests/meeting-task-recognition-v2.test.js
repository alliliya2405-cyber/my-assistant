'use strict';
const assert=require('assert');
const recognition=require('../fixes/meeting-task-recognition-v2-cleanup.js');

const people=[
  {id:'a',name:'Абдуллина Л.Э.',projectIds:['p1','p3']},
  {id:'i',name:'Исса О.Ф.',projectIds:['p2']},
  {id:'k',name:'Королева С.И.',projectIds:['p1','p2']}
];
const projects=[
  {id:'p1',name:'Методическая школа 2.0'},
  {id:'p2',name:'Обучение педагогов'},
  {id:'p3',name:'Числумики'}
];
const parse=(meeting)=>recognition.extractMeetingTaskCandidates({date:'2026-08-11',projectIds:['p1'],...meeting},{people,projects});

let rows=parse({actionItems:'Королева должна подготовить презентацию до 15 августа.'});
assert.equal(rows.length,1);assert.equal(rows[0].assignee,'Королева С.И.');assert.equal(rows[0].title,'Подготовить презентацию');assert.equal(rows[0].deadline,'2026-08-15');assert.equal(rows[0].projectId,'p1');

rows=parse({actionItems:'Исса О.Ф. | Отправить письмо участникам | 2026-08-14 | Обучение педагогов'});
assert.equal(rows.length,1);assert.equal(rows[0].assignee,'Исса О.Ф.');assert.equal(rows[0].title,'Отправить письмо участникам');assert.equal(rows[0].deadline,'2026-08-14');assert.equal(rows[0].projectId,'p2');

rows=parse({actionItems:'Ответственная: Исса О.Ф. Отправить материалы до 12.08.2026.'});
assert.equal(rows.length,1);assert.equal(rows[0].assignee,'Исса О.Ф.');assert.equal(rows[0].deadline,'2026-08-12');

rows=parse({actionItems:'Королева: согласовать программу к 18 августа'});
assert.equal(rows.length,1);assert.equal(rows[0].title,'Согласовать программу');assert.equal(rows[0].deadline,'2026-08-18');

rows=parse({actionItems:'Абдуллина должна составить план до завтра'});
assert.equal(rows.length,1);assert.equal(rows[0].deadline,'2026-08-12');

rows=recognition.extractMeetingTaskCandidates({date:'2026-12-20',projectIds:['p1'],actionItems:'Королева должна подготовить отчет до 10 января'},{people,projects});
assert.equal(rows.length,1);assert.equal(rows[0].deadline,'2027-01-10');

rows=parse({actionItems:'Подготовить презентацию до 15 августа.'});
assert.equal(rows.length,0,'Без исполнителя задача не должна создаваться автоматически');

rows=parse({actionItems:'Королева и Абдуллина должны подготовить презентацию до 15 августа.'});
assert.equal(rows.length,0,'Неоднозначный исполнитель не должен выбираться автоматически');

rows=parse({notes:'Королева сказала, что нужно подготовить презентацию.'});
assert.equal(rows.length,0,'Обычная реплика в заметках не должна превращаться в поручение');

rows=parse({decisions:'Ответственная: Королева С.И. Подготовить протокол до 16 августа.'});
assert.equal(rows.length,1);assert.equal(rows[0].assignee,'Королева С.И.');assert.equal(rows[0].deadline,'2026-08-16');

rows=recognition.extractMeetingTaskCandidates({date:'2026-08-11',projectIds:['p1','p2'],actionItems:'Королева должна подготовить сводку до 15 августа.'},{people,projects});
assert.equal(rows.length,1);assert.equal(rows[0].projectId,'','При нескольких подходящих проектах проект лучше оставить для проверки');

rows=parse({actionItems:'Королева должна подготовить презентацию до 15 августа.',decisions:'Королева должна подготовить презентацию до 15 августа.'});
assert.equal(rows.length,1,'Одинаковое поручение не должно дублироваться');

console.log('meeting-task-recognition-v2: 12 scenarios passed');
