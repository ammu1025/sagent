let intervalId = null;

export function startNotifications(getState, showToast) {
  stopNotifications();
  checkAndNotify(getState(), showToast);
  setTimeout(() => checkAndNotify(getState(), showToast), 15000);
  intervalId = setInterval(() => checkAndNotify(getState(), showToast), 60000);
}

export function stopNotifications() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function checkAndNotify(state, showToast) {
  const pendingHabits = state.habits.filter(h => !h.doneToday);

  if (pendingHabits.length > 0) {
    showToast('warn', '⏰ Habit Reminder', `You have ${pendingHabits.length} pending habit(s) today!`);
  }

  // ── Check per-task notify times ──────────────────────
  const currentTime = getCurrentTime();

  state.habits.forEach(habit => {
    (habit.tasks || []).forEach(task => {
      if (task.done || !task.notifyTime || task.notifySent) return;

      if (task.notifyTime === currentTime) {
        showToast(
          'warn',
          '🔔 Task Reminder',
          `"${task.name}" in habit "${habit.name}" is still pending!`
        );
      }
    });
  });
}

// ── Helpers ───────────────────────────────────────────
function getCurrentTime() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(d) {
  if (!d) return '';
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}