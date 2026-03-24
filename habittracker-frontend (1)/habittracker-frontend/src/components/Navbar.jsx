import { useState } from 'react';

const QUOTES = [
  "Small steps every day lead to big results. 🌱",
  "Consistency is the key to success. 🔑",
  "You don't have to be great to start, but you have to start to be great. 🚀",
  "The secret of getting ahead is getting started. ⚡",
  "Every day is a new chance to improve. 💪",
  "Habits are the compound interest of self-improvement. 📈",
  "Success is the sum of small efforts repeated daily. 🏆",
  "Your future self is watching you right now. 👀",
  "Don't break the chain. 🔥",
  "Progress, not perfection. ✨",
];

export default function Navbar({ user, activeTab, onTabChange, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { id: 'habits',  label: '🎯 Habits' },
    { id: 'history', label: '📜 History' },
  ];

  
  const quoteIndex = user?.username
    ? user.username.charCodeAt(0) % QUOTES.length
    : 0;
  const quote = QUOTES[quoteIndex];

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : 'Today';

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🔥</div>
          <div style={styles.logoText}>
            Habit<span style={{ color: 'var(--accent)' }}>Tracker</span>
          </div>
        </div>

        <div style={styles.tabsWrap}>
          {tabs.map(t => (
            <button
              key={t.id}
              style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
              onClick={() => onTabChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={styles.userArea}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{user?.username}</span>

          <div
            style={{
              ...styles.avatar,
              boxShadow: showProfile ? '0 0 0 3px var(--accent)' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setShowProfile(p => !p)}
            title="View profile"
          >
            {user?.username?.[0]?.toUpperCase()}
          </div>

          <button style={styles.logout} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {showProfile && (
        <>
          <div
            style={styles.backdrop}
            onClick={() => setShowProfile(false)}
          />

          <div style={styles.profileCard}>

            <button
              style={styles.closeBtn}
              onClick={() => setShowProfile(false)}
            >✕</button>

            <div style={styles.profileAvatar}>
              {user?.username?.[0]?.toUpperCase()}
            </div>

            <div style={styles.profileName}>{user?.username}</div>
            <div style={styles.profileEmail}>{user?.email}</div>

            <div style={styles.divider} />

            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <div style={{ ...styles.statVal, color: 'var(--warn)' }}>
                  {user?.streak || 0} 🔥
                </div>
                <div style={styles.statLabel}>Streak</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <div style={{ ...styles.statVal, color: 'var(--accent)' }}>
                  {user?.totalHabits || 0}
                </div>
                <div style={styles.statLabel}>Habits</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <div style={{ ...styles.statVal, color: 'var(--success)' }}>
                  {user?.totalDone || 0}
                </div>
                <div style={styles.statLabel}>Completed</div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.joinedRow}>
              <span style={{ fontSize: 16 }}>📅</span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Member Since
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                  {joinedDate}
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.quoteBox}>
              <div style={styles.quoteText}>"{quote}"</div>
            </div>

            <button style={styles.profileLogout} onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: 64,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 34, height: 34,
    background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
    borderRadius: 8, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 16,
  },
  logoText: { fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800 },
  tabsWrap: {
    display: 'flex', gap: 4,
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 4,
  },
  tab: {
    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    color: 'var(--muted)', border: 'none', background: 'none',
    transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
  },
  tabActive: {
    background: 'var(--accent)', color: '#fff',
    boxShadow: '0 4px 12px rgba(124,106,255,0.4)',
  },
  userArea: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 15, color: '#fff',
    fontFamily: "'Syne',sans-serif",
    transition: 'box-shadow 0.2s',
  },
  logout: {
    background: 'none', border: '1px solid var(--border)',
    borderRadius: 8, padding: '6px 12px', color: 'var(--muted)',
    fontSize: 12, transition: 'all 0.2s', cursor: 'pointer',
  },

  backdrop: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
  },
  profileCard: {
    position: 'fixed', top: 72, right: 20, zIndex: 201,
    width: 300,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '28px 24px 20px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 0,
    animation: 'slideUp 0.3s cubic-bezier(.16,1,.3,1) both',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14,
    background: 'none', border: 'none',
    color: 'var(--muted)', fontSize: 14, cursor: 'pointer',
    padding: '4px 8px', borderRadius: 6,
    transition: 'color 0.2s',
  },
  profileAvatar: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 30, color: '#fff',
    fontFamily: "'Syne',sans-serif",
    marginBottom: 12,
    boxShadow: '0 8px 24px rgba(124,106,255,0.4)',
  },
  profileName: {
    fontFamily: "'Syne',sans-serif", fontSize: 20,
    fontWeight: 800, color: 'var(--text)', marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13, color: 'var(--muted)', marginBottom: 16,
  },
  divider: {
    width: '100%', height: 1,
    background: 'var(--border)', margin: '12px 0',
  },
  statsRow: {
    display: 'flex', alignItems: 'center',
    gap: 0, width: '100%', justifyContent: 'space-around',
    padding: '4px 0',
  },
  statItem: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4,
  },
  statVal: {
    fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800,
  },
  statLabel: {
    fontSize: 11, color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.6px',
  },
  statDivider: {
    width: 1, height: 36, background: 'var(--border)',
  },
  joinedRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    width: '100%', padding: '4px 0',
  },
  quoteBox: {
    width: '100%',
    background: 'linear-gradient(135deg, rgba(124,106,255,0.1), rgba(255,106,155,0.06))',
    border: '1px solid rgba(124,106,255,0.2)',
    borderRadius: 12, padding: '14px 16px',
    margin: '4px 0 8px',
  },
  quoteText: {
    fontSize: 13, color: 'var(--muted)',
    fontStyle: 'italic', lineHeight: 1.6,
    textAlign: 'center',
  },
  profileLogout: {
    width: '100%', marginTop: 8,
    background: 'rgba(255,77,106,0.1)',
    border: '1px solid rgba(255,77,106,0.3)',
    borderRadius: 10, padding: '10px',
    color: 'var(--danger)', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
  },
};