'use strict';

(function (global) {
  const TASK_STATUS = Object.freeze({
    PLANNED: 'planned',
    DONE: 'done'
  });

  function uid() {
    return global.crypto?.randomUUID
      ? global.crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function nowStamp() {
    return new Date().toISOString();
  }

  function normalizeStatus(value, done) {
    if (done === true || value === TASK_STATUS.DONE) {
      return TASK_STATUS.DONE;
    }

    return TASK_STATUS.PLANNED;
  }

  function normalizeTask(source = {}) {
    const status = normalizeStatus(source.status, source.done);

    return {
      id: String(source.id || uid()),

      title: String(source.title || '').trim(),
      description: String(source.description || '').trim(),

      projectId: source.projectId || '',
      subprojectId: source.subprojectId || '',
      sprintId: source.sprintId || '',
      meetingActionId: source.meetingActionId || '',

      date: String(source.date || ''),
      start: String(source.start || ''),
      duration: Number(source.duration || 0),

      priority: String(source.priority || 'current'),
      sphere: String(source.sphere || ''),
      role: String(source.role || ''),
      method: String(source.method || ''),
      result: String(source.result || ''),

      status,
      done: status === TASK_STATUS.DONE,

      createdAt: source.createdAt || nowStamp(),
      updatedAt: source.updatedAt || nowStamp()
    };
  }

  function createTask(input = {}) {
    return normalizeTask({
      ...input,
      id: input.id || uid(),
      createdAt: input.createdAt || nowStamp(),
      updatedAt: input.updatedAt || nowStamp()
    });
  }

  function updateTask(task, changes = {}) {
    return normalizeTask({
      ...task,
      ...changes,
      id: task.id,
      createdAt: task.createdAt,
      updatedAt: nowStamp()
    });
  }

  function completeTask(task) {
    return updateTask(task, {
      status: TASK_STATUS.DONE,
      done: true
    });
  }

  function reopenTask(task) {
    return updateTask(task, {
      status: TASK_STATUS.PLANNED,
      done: false
    });
  }

  function isValidTask(task) {
    return Boolean(
      task &&
      typeof task === 'object' &&
      String(task.id || '').trim() &&
      String(task.title || '').trim()
    );
  }

  global.MyAssistantTaskModel = Object.freeze({
    TASK_STATUS,
    normalizeTask,
    createTask,
    updateTask,
    completeTask,
    reopenTask,
    isValidTask
  });
})(window);
