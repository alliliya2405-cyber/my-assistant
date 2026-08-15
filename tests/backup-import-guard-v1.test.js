'use strict';
const assert=require('assert');
const fs=require('fs');
const fix=fs.readFileSync('fixes/backup-import-guard-v1.js','utf8');
const index=fs.readFileSync('index.html','utf8');

assert(fix.includes("Array.isArray(value.projects)"),'Backup import must require projects array');
assert(fix.includes("Array.isArray(value.tasks)"),'Backup import must require tasks array');
assert(fix.includes("value.settings"),'Backup import must require settings object');
assert(fix.includes("Данные не изменены"),'Invalid backup must explicitly preserve current data');
assert(fix.indexOf("isAssistantBackup(parsed)")<fix.indexOf("localStorage.setItem(STORAGE_KEY+'.beforeImport'"),'Validation must happen before any import-side storage write');
assert(index.includes('fixes/backup-import-guard-v1.js?v=1'),'Backup guard must be loaded by the application');

console.log('backup import guard: ok');
