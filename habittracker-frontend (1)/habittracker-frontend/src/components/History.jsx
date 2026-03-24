import { useState } from 'react';
import { formatDate } from '../services/storage';

export default function History({ history }) {
  if (!history.length) {
    return (
      <div className="empty">
        <div className="empty-icon">📅</div>
        <div className="empty-text">Your completed habits and tasks will appear here.</div>
      </div>
    );
  }

  const grouped = {};
  [...history].reverse().forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Object.keys(grouped).map(date => {
        const entries      = grouped[date];
        const habitEntries = entries.filter(e => e.type === 'habit');
        const taskEntries  = entries.filter(e => e.type === 'task');
        const total        = entries.length;
        const done         = entries.filter(e => e.status === 'completed').length;

        return (
          <div key={date}>
            <div style={styles.dateRow}>
              <span>{formatDate(date)}</span>
              <div style={styles.dateLine} />
              <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {done}/{total} done
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {habitEntries.map((habit, i) => {
                // Match tasks by habitName — case insensitive for safety
                const relatedTasks = taskEntries.filter(t =>
                  t.habitName &&
                  t.habitName.toLowerCase() === habit.name.toLowerCase()
                );
                return (
                  <HabitHistoryRow
                    key={i}
                    habit={habit}
                    tasks={relatedTasks}
                  />
                );
              })}


              {taskEntries
                .filter(t => !habitEntries.find(
                  h => t.habitName && h.name.toLowerCase() === t.habitName.toLowerCase()
                ))
                .map((t, i) => (
                  <div key={i} style={styles.entry}>
                    <div style={{ fontSize: 18 }}>✅</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{t.name}</div>
                      <div style={{ marginTop: 3, display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className="tag tag-task">task</span>
                        {t.time && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t.time}</span>}
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HabitHistoryRow({ habit, tasks }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${expanded ? 'rgba(124,106,255,0.3)' : 'var(--border)'}`,
      borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      
      <div style={styles.habitRow}>
        <div style={{ fontSize: 20 }}>🎯</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{habit.name}</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span className="tag tag-habit">habit</span>
            {habit.time && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{habit.time}</span>}
            {tasks.length > 0 && (
              <span style={{ fontSize: 11, color: 'var(--accent)' }}>
                · {tasks.filter(t => t.status === 'completed').length}/{tasks.length} tasks
              </span>
            )}
          </div>
        </div>

        <StatusBadge status={habit.status} />

        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            ...styles.expandBtn,
            background:  expanded ? 'rgba(124,106,255,0.15)' : 'none',
            borderColor: expanded ? 'rgba(124,106,255,0.4)' : 'var(--border)',
            color:       expanded ? 'var(--accent)' : 'var(--muted)',
            marginLeft: 10,
          }}
        >
          {expanded ? '▲ Hide' : '▼ Tasks'}
        </button>
      </div>

      
      {expanded && (
        <div style={styles.tasksArea}>
          <div style={styles.tasksTitle}>📋 Task History</div>

          {tasks.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>
              No task history recorded for this habit yet.
            </div>
          ) : (
            tasks.map((t, i) => (
              <div key={i} style={styles.taskRow}>
                <div style={{ fontSize: 18 }}>
                  {t.status === 'completed' ? '✅' : '❌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                  {t.time && (
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {t.time}
                    </div>
                  )}
                </div>
                <StatusBadge status={t.status} small />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, small }) {
  const done = status === 'completed';
  return (
    <div style={{
      fontSize: small ? 11 : 12, fontWeight: 600,
      padding: small ? '2px 8px' : '4px 12px',
      borderRadius: 20, whiteSpace: 'nowrap',
      background: done ? 'rgba(42,255,170,0.1)' : 'rgba(255,77,106,0.1)',
      color: done ? 'var(--success)' : 'var(--danger)',
    }}>
      {done ? '✓ Completed' : '✗ Missed'}
    </div>
  );
}

const styles = {
  dateRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 12, fontWeight: 600, color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10,
  },
  dateLine: { flex: 1, height: 1, background: 'var(--border)' },
  entry: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '12px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  habitRow: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
  },
  expandBtn: {
    border: '1px solid', borderRadius: 8, fontSize: 12,
    fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  tasksArea: {
    borderTop: '1px solid var(--border)',
    background: 'rgba(124,106,255,0.04)',
    padding: '14px 18px',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  tasksTitle: {
    fontSize: 11, fontWeight: 700, color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6,
  },
  taskRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
};