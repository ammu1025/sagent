import { useState, useEffect } from 'react';
import './App.css';
import { loadState, saveState, today } from './services/storage';
import { startNotifications, stopNotifications } from './services/notifications';
import { apiUpdateHabit, apiDeleteHabit, apiCreateTask, apiUpdateTask, apiDeleteTask } from './services/api';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import History from './components/History';
import Chatbot from './components/Chatbot';

let _addToast = null;
export function toast(type, title, msg) {
  if (_addToast) _addToast({ type, title, msg, id: Date.now() + Math.random() });
}

export default function App() {
  const [state, setState]         = useState(() => loadState());
  const [activeTab, setActiveTab] = useState('habits');
  const [toasts, setToasts]       = useState([]);

  _addToast = (t) => setToasts(prev => [...prev, t]);

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    if (!toasts.length) return;
    const id = toasts[0].id;
    const t = setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
    return () => clearTimeout(t);
  }, [toasts]);

  useEffect(() => {
    if (!state.user) { stopNotifications(); return; }
    startNotifications(() => state, (type, title, msg) => toast(type, title, msg));
    return () => stopNotifications();
  }, [state.user]);

  // ── Daily reset ───────────────────────────────────────
  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];

    // Only reset if last reset was on a different day
    if (state.lastResetDate === todayDate) return;

    setState(s => ({
      ...s,
      lastResetDate: todayDate,
      habits: s.habits.map(h => {
        if (h.freq !== 'Daily') return h;  // only reset Daily habits
        return {
          ...h,
          doneToday: false,
          tasks: (h.tasks || []).map(t => ({
            ...t,
            done: false,
            timerRemaining: t.timerDuration,
            timerRunning: false,
            notifySent: false,
          })),
        };
      }),
    }));
  }, [state.lastResetDate]); // eslint-disable-line

  // ── Auth ──────────────────────────────────────────────
  function logout() {
    stopNotifications();
    if (state.user) {
      localStorage.setItem(`sf_data_${state.user.username}`, JSON.stringify({
        habits:        state.habits,
        tasks:         state.tasks,
        history:       state.history,
        streak:        state.streak,
        lastStreakDate: state.lastStreakDate,
        lastResetDate:  state.lastResetDate,
      }));
    }
    setState(s => ({ ...s, user: null }));
    setActiveTab('habits');
  }

  // ── Habits ────────────────────────────────────────────
  function addHabit(habit) {
    setState(s => ({
      ...s,
      habits: [...s.habits, { ...habit, tasks: habit.tasks || [] }],
    }));
    toast('success', '✅ Habit Added', `"${habit.name}" is now tracked!`);
  }

  function toggleHabit(id) {
    setState(s => {
      const habits = s.habits.map(h => {
        if (h.id !== id) return h;
        const doneToday = !h.doneToday;
        apiUpdateHabit(id, doneToday ? 'Completed' : 'Not Completed');
        const tasks = (h.tasks || []).map(t => ({
          ...t,
          done: doneToday,
          timerRunning: false,
        }));
        return { ...h, doneToday, tasks };
      });

      const changed = habits.find(h => h.id === id);
      const entry = {
        type:   'habit',
        name:   changed.name,
        status: changed.doneToday ? 'completed' : 'missed',
        date:   new Date().toISOString().split('T')[0],
        time:   new Date().toLocaleTimeString(),
      };
      const taskEntries = (changed.tasks || []).map(t => ({
        type:      'task',
        name:      t.name,
        habitName: changed.name,
        status:    changed.doneToday ? 'completed' : 'missed',
        date:      new Date().toISOString().split('T')[0],
        time:      new Date().toLocaleTimeString(),
      }));

      // ── 1 day = 1 streak ──────────────────────────────
      const todayDate           = new Date().toISOString().split('T')[0];
      const alreadyCountedToday = s.lastStreakDate === todayDate;
      const anyDoneToday        = habits.some(h => h.doneToday);
      const streak = anyDoneToday && !alreadyCountedToday
        ? s.streak + 1
        : !anyDoneToday
        ? Math.max(0, s.streak - 1)
        : s.streak;
      const lastStreakDate = anyDoneToday ? todayDate : s.lastStreakDate;

      if (changed.doneToday)
        toast('success', '🔥 Habit Done!', `"${changed.name}" — Streak: ${streak} 🔥`);

      return {
        ...s,
        habits,
        history: [...s.history, entry, ...taskEntries],
        streak,
        lastStreakDate,
      };
    });
  }

  function deleteHabit(id) {
    apiDeleteHabit(id);
    setState(s => ({ ...s, habits: s.habits.filter(h => h.id !== id) }));
  }

  // ── Habit Tasks ───────────────────────────────────────
  async function addTaskToHabit(habitId, taskName, timerDuration = 0, notifyTime = '', habitName = '') {
    let taskId = Date.now();
    if (state.user?.userId) {
      const saved = await apiCreateTask(taskName, '', today(), habitId);
      if (saved && saved.taskId) taskId = saved.taskId;
    }
    setState(s => ({
      ...s,
      habits: s.habits.map(h => {
        if (h.id !== habitId) return h;
        const newTask = {
          id: taskId,
          name: taskName,
          done: false,
          timerDuration,
          timerRemaining: timerDuration,
          timerRunning: false,
          notifyTime,
          notifySent: false,
        };
        return { ...h, tasks: [...(h.tasks || []), newTask] };
      }),
    }));
    toast('info', '📋 Task Added', 'Task added to habit!');
  }

  function toggleHabitTask(habitId, taskId) {
    setState(s => {
      const habits = s.habits.map(h => {
        if (h.id !== habitId) return h;

        const tasks   = (h.tasks || []).map(t =>
          t.id === taskId ? { ...t, done: !t.done, timerRunning: false } : t
        );
        const changed = tasks.find(t => t.id === taskId);
        const allDone = tasks.length > 0 && tasks.every(t => t.done);

        const taskEntry = {
          type:      'task',
          name:      changed.name,
          habitName: h.name,
          status:    changed.done ? 'completed' : 'missed',
          date:      new Date().toISOString().split('T')[0],
          time:      new Date().toLocaleTimeString(),
        };

        if (allDone && !h.doneToday) {
          apiUpdateHabit(h.id, 'Completed');
          toast('success', '🔥 All Tasks Done!', `"${h.name}" completed!`);
          return { ...h, tasks, doneToday: true, _taskEntry: taskEntry };
        }

        if (!allDone && h.doneToday) {
          apiUpdateHabit(h.id, 'Not Completed');
          return { ...h, tasks, doneToday: false, _taskEntry: taskEntry };
        }

        return { ...h, tasks, _taskEntry: taskEntry };
      });

      const newEntries  = habits.filter(h => h._taskEntry).map(h => h._taskEntry);
      const cleanHabits = habits.map(({ _taskEntry, ...h }) => h);

      // ── 1 day = 1 streak ──────────────────────────────
      const todayDate           = new Date().toISOString().split('T')[0];
      const alreadyCountedToday = s.lastStreakDate === todayDate;
      const anyDoneToday        = cleanHabits.some(h => h.doneToday);
      const streak = anyDoneToday && !alreadyCountedToday
        ? s.streak + 1
        : s.streak;
      const lastStreakDate = anyDoneToday ? todayDate : s.lastStreakDate;

      return {
        ...s,
        habits:  cleanHabits,
        history: [...s.history, ...newEntries],
        streak,
        lastStreakDate,
      };
    });
  }

  function deleteHabitTask(habitId, taskId) {
    apiDeleteTask(taskId);
    setState(s => ({
      ...s,
      habits: s.habits.map(h => {
        if (h.id !== habitId) return h;
        return { ...h, tasks: (h.tasks || []).filter(t => t.id !== taskId) };
      }),
    }));
  }

  // ── Task Timer ────────────────────────────────────────
  function updateHabitTaskTimer(habitId, taskId, patch) {
    setState(s => ({
      ...s,
      habits: s.habits.map(h => {
        if (h.id !== habitId) return h;
        return {
          ...h,
          tasks: (h.tasks || []).map(t =>
            t.id === taskId ? { ...t, ...patch } : t
          ),
        };
      }),
    }));
  }

  // ── Render ────────────────────────────────────────────
  return (
    <>
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />

      {!state.user ? (
        <LoginPage
          state={state}
          updateState={setState}
          showToast={(type, title, msg) => toast(type, title, msg)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Navbar
            user={{
              ...state.user,
              streak:      state.streak,
              totalHabits: state.habits.length,
              totalDone:   state.habits.filter(h => h.doneToday).length,
            }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={logout}
          />
          <main style={{ flex: 1 }}>

            {activeTab === 'habits' && (
              <div className="section-wrap">
                <div className="section-title">Habits 🎯</div>
                <div className="section-sub">Build routines that compound over time.</div>
                <Dashboard habits={state.habits} streak={state.streak} />
                <HabitForm onAdd={addHabit} userId={state.user?.userId} />
                <HabitList
                  habits={state.habits}
                  onToggle={toggleHabit}
                  onDelete={deleteHabit}
                  onAddTask={addTaskToHabit}
                  onToggleTask={toggleHabitTask}
                  onDeleteTask={deleteHabitTask}
                  onUpdateTaskTimer={updateHabitTaskTimer}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="section-wrap">
                <div className="section-title">History 📜</div>
                <div className="section-sub">A record of your consistency and growth.</div>
                <History history={state.history} />
              </div>
            )}

          </main>
        </div>
      )}
      <Chatbot state={state} />
      <ToastStack toasts={toasts} />
    </>
  );
}

function ToastStack({ toasts }) {
  const icons = { warn: '⚠️', success: '🎉', info: 'ℹ️' };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon">{icons[t.type] || '🔔'}</div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}