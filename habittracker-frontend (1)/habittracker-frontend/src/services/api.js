const BASE = 'http://localhost:8080/api';
export async function apiRegister(username, email, password) {
  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Cannot connect to server. Is Spring Boot running?' };
  }
}

export async function apiLogin(username, password) {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Cannot connect to server. Is Spring Boot running?' };
  }
}

// ── HABITS ───────────────────────────────────────────────
export async function apiGetHabits(userId) {
  try {
    const res = await fetch(`${BASE}/habits/user/${userId}`);
    return await res.json();
  } catch { return []; }
}

export async function apiCreateHabit(habitName, frequency, userId) {
  try {
    const res = await fetch(`${BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitName, frequency, userId }),
    });
    return await res.json();
  } catch { return null; }
}

export async function apiUpdateHabit(id, status, streaks) {
  try {
    const res = await fetch(`${BASE}/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, streaks }),
    });
    return await res.json();
  } catch { return null; }
}

export async function apiDeleteHabit(id) {
  try {
    await fetch(`${BASE}/habits/${id}`, { method: 'DELETE' });
    return true;
  } catch { return false; }
}

// ── TASKS (inside habits) ────────────────────────────────
export async function apiGetTasks(habitId) {
  try {
    const res = await fetch(`${BASE}/tasks/habit/${habitId}`);
    return await res.json();
  } catch { return []; }
}

export async function apiCreateTask(title, description, dueDate, habitId) {
  try {
    const res = await fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, habitId }),
    });
    return await res.json();
  } catch { return null; }
}

export async function apiUpdateTask(id, status) {
  try {
    const res = await fetch(`${BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch { return null; }
}

export async function apiDeleteTask(id) {
  try {
    await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
    return true;
  } catch { return false; }
}