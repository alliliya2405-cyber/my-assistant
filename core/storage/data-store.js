'use strict';

(function (global) {
  const STORAGE_KEY = 'myAssistantProFinal.v1';

  function backupKey(name) {
    const safeName = String(name || '').trim();
    if (!safeName) {
      throw new Error('Backup name is required');
    }
    return `${STORAGE_KEY}.${safeName}`;
  }

  function readJson(key) {
    const raw = global.localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  }

  function writeJson(key, data) {
    const serialized = JSON.stringify(data);
    global.localStorage.setItem(key, serialized);
    return true;
  }

  function load() {
    return readJson(STORAGE_KEY);
  }

  function save(data) {
    return writeJson(STORAGE_KEY, data);
  }

  function saveBackup(name, data) {
    return writeJson(backupKey(name), data);
  }

  function loadBackup(name) {
    return readJson(backupKey(name));
  }

  global.MyAssistantDataStore = Object.freeze({
    STORAGE_KEY,
    load,
    save,
    saveBackup,
    loadBackup
  });
})(window);
