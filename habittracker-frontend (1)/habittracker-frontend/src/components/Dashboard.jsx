export default function Dashboard({ habits = [], streak = 0 }) {
  const total  = habits.length;
  const done   = habits.filter(h => h.doneToday).length;
  const pct    = total ? Math.round((done / total) * 100) : 0;
  const circ   = 150.8;
  const offset = circ - (pct / 100) * circ;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div style={styles.banner}>
      <div>
        <div style={styles.bigNum}>{streak}</div>
        <div style={styles.label}>🔥 Current Streak (days)</div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={styles.statsRow}>
        <MiniStat val={habits.length} label="Habits"    color="var(--accent)"  />
        <MiniStat val={done}          label="Done Today" color="var(--success)" />
        <MiniStat val={total - done}  label="Remaining"  color="var(--warn)"   />
      </div>

      <div style={{ width: 1, height: 60, background: 'var(--border)' }} />

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{todayStr}</div>
        <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
          <circle fill="none" stroke="var(--border)" strokeWidth="5" cx="32" cy="32" r="24" />
          <circle
            fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round"
            cx="32" cy="32" r="24"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <text
            x="32" y="32"
            textAnchor="middle" dominantBaseline="middle"
            style={{
              fill: 'var(--text)', fontSize: 13, fontWeight: 800,
              fontFamily: "'Syne',sans-serif",
              transform: 'rotate(90deg)', transformOrigin: '32px 32px'
            }}
          >
            {pct}%
          </text>
        </svg>
      </div>
    </div>
  );
}

function MiniStat({ val, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color }}>{val}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  );
}

const styles = {
  banner: {
    background: 'linear-gradient(135deg, rgba(124,106,255,0.12), rgba(255,106,155,0.08))',
    border: '1px solid rgba(124,106,255,0.25)',
    borderRadius: 16, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 20,
    marginBottom: 24, flexWrap: 'wrap',
  },
  bigNum: {
    fontFamily: "'Syne',sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  label: { fontSize: 13, color: 'var(--muted)', marginTop: 2 },
  statsRow: { display: 'flex', gap: 20, alignItems: 'center' },
};