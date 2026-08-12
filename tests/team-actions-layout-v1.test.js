'use strict';

const assert=require('assert');
const fs=require('fs');

const management=fs.readFileSync('fixes/team-management-v1.js','utf8');
const removal=fs.readFileSync('fixes/team-remove-member-v1.js','utf8');
const css=fs.readFileSync('styles/team-management-v1.css','utf8');

assert(management.includes("group.className='team-card-actions'"),'Редактор должен создавать единую группу действий');
assert(management.includes('group.appendChild(btn)'),'Кнопка редактирования должна переноситься в группу действий');
assert(removal.includes("group=card.querySelector('.team-card-actions')"),'Удаление должно использовать ту же группу действий');
assert(removal.includes('group.appendChild(manage)'),'Участие в проектах должно добавляться в группу действий');
assert(removal.includes('group.appendChild(del)'),'Удаление участника должно добавляться в группу действий');
assert(css.includes('flex-wrap:nowrap'),'На широком экране действия не должны переноситься на новую строку');
assert(css.includes('white-space:nowrap'),'Текст кнопок не должен ломаться внутри кнопки');

console.log('team actions layout: ok');
