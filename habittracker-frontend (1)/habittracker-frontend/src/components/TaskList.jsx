import { useEffect, useRef } from 'react';
import { today, formatDate } from '../services/storage';

export default function TaskList({ tasks, onToggle, onDelete, onUpdateTimer }) {
  const done = tasks.filter(t => t.done).length;

  if (!tasks.length) {
    return (
      <div className="empty">
        <div className="empty-icon">📋</div>
        <div className="empty-text">No tasks yet. Create your first task above!</div>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>All Tasks</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{done}/{tasks.length} done</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.map((t, i) => (
          <TaskItem
            key={t.id}
            task={t}
            index={i}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateTimer={onUpdateTimer}
          />
        ))}
      </div>
    </div>
  );
}

function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function TaskItem({ task, index, onToggle, onDelete, onUpdateTimer }) {
  const intervalRef = useRef(null);

  const now       = today();
  const isOverdue = !task.done && task.due < now;
  const isToday   = task.due === now;
  const hasTimer  = task.timerDuration > 0;

  const dueColor = task.done ? 'var(--muted)' : isOverdue ? 'var(--danger)' : isToday ? 'var(--warn)' : 'var(--accent3)';
  const dueIcon  = task.done ? '✅' : isOverdue ? '🚨' : isToday ? '⚡' : '📅';

  useEffect(() => {
    if (!task.timerRunning || task.done) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const next = task.timerRemaining - 1;
      if (next <= 0) {
        clearInterval(intervalRef.current);
        onUpdateTimer(task.id, { timerRemaining: 0, timerRunning: false });
        onToggle(task.id);
      } else {
        onUpdateTimer(task.id, { timerRemaining: next });
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [task.timerRunning, task.timerRemaining, task.done]); // eslint-disable-line

  function toggleTimer() {
    if (task.done) return;
    onUpdateTimer(task.id, { timerRunning: !task.timerRunning });
  }

  function resetTimer() {
    onUpdateTimer(task.id, { timerRemaining: task.timerDuration, timerRunning: false });
  }

  const timerPercent = hasTimer
    ? Math.max(0, Math.min(100, (task.timerRemaining / task.timerDuration) * 100))
    : 0;

  const timerColor =
    timerPercent > 50 ? 'var(--accent3)' :
    timerPercent > 20 ? 'var(--warn)' : 'var(--danger)';

  return (
    <div style={{
      ...styles.item,
      borderColor: isOverdue ? 'rgba(255,77,106,0.3)' : 'var(--border)',
      animationDelay: `${index * 40}ms`,
    }}>
      <div
        onClick={() => onToggle(task.id)}
        style={{
          ...styles.check,
          background: task.done ? 'var(--accent)' : 'transparent',
          borderColor: task.done ? 'var(--accent)' : 'var(--border)',
          color: task.done ? '#fff' : 'transparent',
        }}
      >✓</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 500, fontSize: 15,
          textDecoration: task.done ? 'line-through' : 'none',
          color: task.done ? 'var(--muted)' : 'var(--text)',
        }}>
          {task.title}
        </div>

        {task.desc && (
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{task.desc}</div>
        )}

        <div style={{ fontSize: 12, color: dueColor, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          {dueIcon} Due: {formatDate(task.due)}{isOverdue && !task.done ? ' · OVERDUE' : ''}
        </div>

        {hasTimer && (
          <div style={{ marginTop: 10 }}>
            <div style={styles.timerTrack}>
              <div style={{
                ...styles.timerFill,
                width: `${timerPercent}%`,
                background: timerColor,
                transition: 'width 1s linear, background 0.5s',
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 15, fontWeight: 700,
                color: task.done ? 'var(--muted)' : timerColor, minWidth: 50,
              }}>
                {fmt(task.timerRemaining)}
              </span>

              {!task.done && (
                <>
                  <button onClick={toggleTimer} style={{
                    ...styles.timerBtn,
                    background: task.timerRunning ? 'rgba(255,77,106,0.15)' : 'rgba(106,255,203,0.12)',
                    color: task.timerRunning ? 'var(--danger)' : 'var(--accent3)',
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
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Timer stopped</span>
              )}
            </div>
          </div>
        )}
      </div>

      <button className="btn-icon" onClick={() => onDelete(task.id)}>🗑</button>
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  item: {
    background: 'var(--surface)', border: '1px solid',
    borderRadius: 'var(--r)', padding: '16px 20px',
    display: 'flex', alignItems: 'flex-start', gap: 14,
    animation: 'fadeIn 0.3s ease both', transition: 'border-color 0.2s',
  },
  check: {
    width: 22, height: 22, borderRadius: 6, border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
    marginTop: 2, fontSize: 12,
  },
  timerTrack: { height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' },
  timerFill:  { height: '100%', borderRadius: 99 },
  timerBtn: {
    fontSize: 11, fontWeight: 600, padding: '4px 10px',
    borderRadius: 50, border: '1px solid', cursor: 'pointer',
    background: 'none', transition: 'all 0.2s',
  },
};