'use strict';
const assert=require('assert');
const api=require('../fixes/task-calendar-range-v1.js');

const task={
  id:'task-1',title:'Живые вебинары',date:'2026-08-17',endDate:'2026-08-21',
  start:'10:00',end:'15:00',duration:300,done:false,
  dailySchedule:{'2026-08-18':{start:'09:00',end:'12:00'},'2026-08-20':{start:'14:00',end:'16:00'}}
};

assert.deepStrictEqual(api.taskRange(task),['2026-08-17','2026-08-21']);
assert.deepStrictEqual(api.datesBetween('2026-08-17','2026-08-21'),['2026-08-17','2026-08-18','2026-08-19','2026-08-20','2026-08-21']);
assert(api.occursOn(task,'2026-08-17'));
assert(api.occursOn(task,'2026-08-19'));
assert(api.occursOn(task,'2026-08-21'));
assert(!api.occursOn(task,'2026-08-16'));
assert(!api.occursOn(task,'2026-08-22'));
assert(api.overlaps(task,'2026-08-18','2026-08-19'));
assert(api.overlaps(task,'2026-08-10','2026-08-17'));
assert(!api.overlaps(task,'2026-08-22','2026-08-30'));
assert.deepStrictEqual(api.dayTimes(task,'2026-08-17'),{start:'10:00',end:'15:00'});
assert.deepStrictEqual(api.dayTimes(task,'2026-08-18'),{start:'09:00',end:'12:00'});
assert.strictEqual(api.intervalLabel(task,'2026-08-18'),'09:00–12:00');
assert.strictEqual(api.intervalLabel(task,'2026-08-19'),'10:00–15:00');

const occurrences=api.occurrencesInRange([task],'2026-08-17','2026-08-21');
assert.strictEqual(occurrences.length,5,'one five-day task must render on five calendar days');
assert(occurrences.every(item=>item.id==='task-1'),'calendar occurrences must keep the original task id');
assert.deepStrictEqual(occurrences.map(item=>item.date),['2026-08-17','2026-08-18','2026-08-19','2026-08-20','2026-08-21']);
assert.strictEqual(occurrences[1].start,'09:00–12:00');
assert.strictEqual(occurrences[2].start,'10:00–15:00');
assert.strictEqual(task.date,'2026-08-17','rendering occurrences must not mutate the persisted task');
assert.strictEqual(task.endDate,'2026-08-21','rendering occurrences must preserve the persisted range');

const legacy={id:'legacy',date:'2026-08-19',start:'11:00',duration:90};
assert.strictEqual(api.intervalLabel(legacy,'2026-08-19'),'11:00–12:30','legacy duration must still derive an end time');
assert.strictEqual(api.occurrencesInRange([legacy],'2026-08-17','2026-08-21').length,1,'single-day tasks must remain single occurrences');
console.log('multi-day task calendar range behavior: ok');
