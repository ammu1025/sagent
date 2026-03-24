import { useState, useEffect, useRef } from 'react';

// ── Timer end sound (3 beeps using Web Audio API) ──────────────────
function playTimerEndSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  [0, 0.3, 0.6].forEach(delay => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.5, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.25);
  });
}

export default function HabitList({ habits, onToggle, onDelete, onAddTask, onToggleTask, onDeleteTask, onUpdateTaskTimer }) {
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  if (!habits.length) {
    return (
      <div className="empty">
        <div className="empty-icon">🌱</div>
        <div className="empty-text">No habits yet. Add your first one above!</div>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Today's Habits</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{todayStr}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {habits.map((h, i) => (
          <HabitItem
            key={h.id}
            habit={h}
            index={i}
            onToggle={onToggle}
            onDelete={onDelete}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onUpdateTaskTimer={onUpdateTaskTimer}
          />
        ))}
      </div>
    </div>
  );
}

function HabitItem({ habit, index, onToggle, onDelete, onAddTask, onToggleTask, onDeleteTask, onUpdateTaskTimer }) {
  const [expanded,  setExpanded]  = useState(false);
  const [newTask,   setNewTask]   = useState('');
  const [timerMins, setTimerMins] = useState('');
  const [timerSecs, setTimerSecs] = useState('');

  const tasks      = habit.tasks || [];
  const totalTasks = tasks.length;
  const doneTasks  = tasks.filter(t => t.done).length;
  const allDone    = totalTasks > 0 && doneTasks === totalTasks;

  const badgeClass = {
    Daily:   'badge badge-daily',
    Weekly:  'badge badge-weekly',
    Monthly: 'badge badge-monthly',
  }[habit.freq] || 'badge badge-daily';

  async function handleAddTask() {
    if (!newTask.trim()) return;
    const totalSeconds =
      (parseInt(timerMins || '0', 10) * 60) + parseInt(timerSecs || '0', 10);
    await onAddTask(habit.id, newTask.trim(), totalSeconds);
    setNewTask('');
    setTimerMins('');
    setTimerSecs('');
  }

  return (
    <div style={{
      ...styles.card,
      borderColor: allDone ? 'rgba(42,255,170,0.35)' : 'var(--border)',
      animationDelay: `${index * 40}ms`,
    }}>
      <div style={styles.topRow}>
        <div
          onClick={() => onToggle(habit.id)}
          style={{
            ...styles.check,
            background:  habit.doneToday ? 'var(--success)' : 'transparent',
            borderColor: habit.doneToday ? 'var(--success)' : 'var(--border)',
            color:       habit.doneToday ? '#000' : 'transparent',
          }}
          title="Mark habit complete"
        >✓</div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 600, fontSize: 15,
            color: habit.doneToday ? 'var(--muted)' : 'var(--text)',
            textDecoration: habit.doneToday ? 'line-through' : 'none',
          }}>
            {habit.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {habit.freq}
            {totalTasks > 0 && (
              <span style={{
                marginLeft: 8,
                color: allDone ? 'var(--success)' : 'var(--warn)',
                fontWeight: 500,
              }}>
                · {doneTasks}/{totalTasks} tasks done
              </span>
            )}
          </div>
        </div>

        <span className={badgeClass}>{habit.freq}</span>
        <div style={styles.streak}>{habit.streak} 🔥</div>

        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            ...styles.expandBtn,
            background:  expanded ? 'rgba(124,106,255,0.15)' : 'none',
            borderColor: expanded ? 'var(--accent)' : 'var(--border)',
            color:       expanded ? 'var(--accent)' : 'var(--muted)',
          }}
        >
          {expanded ? '▲ Hide' : '▼ Tasks'}
        </button>

        <button className="btn-icon" onClick={() => onDelete(habit.id)}>🗑</button>
      </div>

      {totalTasks > 0 && (
        <div style={styles.progressWrap}>
          <div style={{
            ...styles.progressBar,
            width: `${(doneTasks / totalTasks) * 100}%`,
            background: allDone ? 'var(--success)' : 'var(--accent)',
          }} />
        </div>
      )}

      {expanded && (
        <div style={styles.tasksArea}>
          <div style={styles.tasksTitle}>📋 Tasks — mark each as Done or Not Done</div>

          {tasks.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--muted)', padding: '6px 0' }}>
              No tasks yet. Add one below!
            </div>
          ) : (
            tasks.map(t => (
              <TaskRow
                key={t.id}
                task={t}
                habitId={habit.id}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
                onUpdateTaskTimer={onUpdateTaskTimer}
              />
            ))
          )}

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={styles.addTaskRow}>
              <input
                className="form-input"
                style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                placeholder="Add another task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              />
              <button onClick={handleAddTask} style={styles.addTaskBtn}>
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                ⏱ Timer (optional):
              </span>
              <input
                className="form-input"
                type="number" min="0" max="999"
                placeholder="mm"
                value={timerMins}
                onChange={e => setTimerMins(e.target.value)}
                style={{ width: 64, padding: '8px 10px', fontSize: 13, textAlign: 'center' }}
              />
              <span style={{ color: 'var(--muted)', fontWeight: 700 }}>:</span>
              <input
                className="form-input"
                type="number" min="0" max="59"
                placeholder="ss"
                value={timerSecs}
                onChange={e => setTimerSecs(e.target.value)}
                style={{ width: 64, padding: '8px 10px', fontSize: 13, textAlign: 'center' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, habitId, onToggleTask, onDeleteTask, onUpdateTaskTimer }) {
  const intervalRef = useRef(null);
  const hasTimer    = task.timerDuration > 0;

  useEffect(() => {
    if (!task.timerRunning || task.done) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const next = task.timerRemaining - 1;
      if (next <= 0) {
        clearInterval(intervalRef.current);
        playTimerEndSound(); // ← plays 3 beeps when timer ends
        onUpdateTaskTimer(habitId, task.id, { timerRemaining: 0, timerRunning: false });
        onToggleTask(habitId, task.id);
      } else {
        onUpdateTaskTimer(habitId, task.id, { timerRemaining: next });
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [task.timerRunning, task.timerRemaining, task.done]); // eslint-disable-line

  function toggleTimer() {
    if (task.done) return;
    onUpdateTaskTimer(habitId, task.id, { timerRunning: !task.timerRunning });
  }

  function resetTimer() {
    onUpdateTaskTimer(habitId, task.id, {
      timerRemaining: task.timerDuration,
      timerRunning: false,
    });
  }

  const timerPercent = hasTimer
    ? Math.max(0, Math.min(100, (task.timerRemaining / task.timerDuration) * 100))
    : 0;

  const timerColor =
    timerPercent > 50 ? 'var(--accent3)' :
    timerPercent > 20 ? 'var(--warn)' : 'var(--danger)';

  function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div style={styles.taskRow}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14, fontWeight: 500,
          color: task.done ? 'var(--muted)' : 'var(--text)',
          textDecoration: task.done ? 'line-through' : 'none',
        }}>
          {task.name}
        </div>

        {task.desc && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{task.desc}</div>
        )}
        {task.due && (
          <div style={{ fontSize: 11, color: 'var(--accent3)', marginTop: 2 }}>📅 Due: {task.due}</div>
        )}

        {hasTimer && (
          <div style={{ marginTop: 8 }}>
            <div style={styles.timerTrack}>
              <div style={{
                ...styles.timerFill,
                width: `${timerPercent}%`,
                background: timerColor,
                transition: 'width 1s linear, background 0.5s',
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 14, fontWeight: 700,
                color: task.done ? 'var(--muted)' : timerColor, minWidth: 46,
              }}>
                {fmt(task.timerRemaining)}
              </span>

              {!task.done && (
                <>
                  <button onClick={toggleTimer} style={{
                    ...styles.timerBtn,
                    background: task.timerRunning ? 'rgba(255,77,106,0.15)' : 'rgba(106,255,203,0.12)',
                    color:      task.timerRunning ? 'var(--danger)' : 'var(--accent3)',
                    borderColor: task.timerRunning ? 'var(--danger)' : 'var(--accent3)',
                  }}>
                    {task.timerRunning ? '⏸ Pause' : '▶ Start'}
                  </button>
                  <button onClick={resetTimer} style={{
                    ...styles.timerBtn,
                    background: 'rgba(124,106,255,0.1)',
                    color: 'var(--accent)', borderColor: 'var(--accent)',
                  }}>
                    ↺ Reset
                  </button>
                </>
              )}

              {task.done && (
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Timer stopped</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={styles.doneButtons}>
        <button
          onClick={() => { if (!task.done) onToggleTask(habitId, task.id); }}
          style={{
            ...styles.doneBtn,
            background: task.done ? 'rgba(42,255,170,0.15)' : 'rgba(42,255,170,0.05)',
            border: `1px solid ${task.done ? 'rgba(42,255,170,0.5)' : 'rgba(42,255,170,0.2)'}`,
            color: 'var(--success)',
            fontWeight: task.done ? 700 : 400,
            transform: task.done ? 'scale(1.04)' : 'scale(1)',
          }}
        >
          ✓ Done
        </button>
        <button
          onClick={() => { if (task.done) onToggleTask(habitId, task.id); }}
          style={{
            ...styles.doneBtn,
            background: !task.done ? 'rgba(255,204,68,0.15)' : 'rgba(255,204,68,0.05)',
            border: `1px solid ${!task.done ? 'rgba(255,204,68,0.5)' : 'rgba(255,204,68,0.2)'}`,
            color: 'var(--warn)',
            fontWeight: !task.done ? 700 : 400,
            transform: !task.done ? 'scale(1.04)' : 'scale(1)',
          }}
        >
          ✗ Not Done
        </button>
      </div>

      <button
        className="btn-icon"
        style={{ marginLeft: 8 }}
        onClick={() => onDeleteTask(habitId, task.id)}
      >🗑</button>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  card: {
    background: 'var(--surface)', border: '1px solid',
    borderRadius: 'var(--r)', padding: '16px 20px',
    animation: 'fadeIn 0.3s ease both', transition: 'border-color 0.2s',
  },
  topRow:  { display: 'flex', alignItems: 'center', gap: 14 },
  check: {
    width: 28, height: 28, borderRadius: '50%', border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, fontSize: 14,
  },
  streak: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 13, color: 'var(--warn)',
    fontWeight: 600, fontFamily: "'Syne',sans-serif",
  },
  expandBtn: {
    border: '1px solid', borderRadius: 8, fontSize: 12,
    fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  progressWrap: {
    height: 3, background: 'var(--border)',
    borderRadius: 99, marginTop: 12, overflow: 'hidden',
  },
  progressBar: {
    height: '100%', borderRadius: 99, transition: 'width 0.4s ease',
  },
  tasksArea: {
    marginTop: 16, paddingTop: 16,
    borderTop: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  tasksTitle: {
    fontSize: 11, fontWeight: 700, color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8,
  },
  taskRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  doneButtons: { display: 'flex', gap: 6, flexShrink: 0 },
  doneBtn: {
    borderRadius: 8, padding: '6px 14px',
    fontSize: 12, cursor: 'pointer',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  addTaskRow: {
    display: 'flex', gap: 8, alignItems: 'center',
  },
  addTaskBtn: {
    background: 'var(--accent)', border: 'none',
    borderRadius: 8, padding: '10px 16px',
    color: '#fff', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap',
  },
  timerTrack: { height: 4, borderRadius: 99, background: 'var(--border)', overflow: 'hidden', marginTop: 6 },
  timerFill:  { height: '100%', borderRadius: 99 },
  timerBtn: {
    fontSize: 11, fontWeight: 600, padding: '3px 10px',
    borderRadius: 50, border: '1px solid', cursor: 'pointer',
    background: 'none', transition: 'all 0.2s',
  },
};