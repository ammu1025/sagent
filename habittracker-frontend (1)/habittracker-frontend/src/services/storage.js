const KEY = 'streakforge_state';

export const defaultState = {
  user: null,
  habits: [],
  tasks: [],
  history: [],
  streak: 0,
  lastStreakDate: null,  // tracks last day streak was incremented
  lastResetDate: null,  // tracks last day daily habits were reset
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(KEY);
}

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(d) {
  if (!d) return '';
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}