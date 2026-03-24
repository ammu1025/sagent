import { useState, useRef, useEffect } from 'react';

const QUICK_QUESTIONS = [
  "What are my current streaks? 🔥",
  "How many habits do I have?",
  "Show my progress today",
  "Give me motivation!",
];

const BOT_RESPONSES = {
  streak:      (streaks) => `Your current best streak is ${streaks} 🔥 Keep going! Every day counts!`,
  habits:      (count)   => `You have ${count} habit${count !== 1 ? 's' : ''} tracked. Consistency is key! 💪`,
  progress:    (done, total) => total === 0
    ? "You haven't added any habits yet. Start by adding one! 🌱"
    : `Today you've completed ${done} out of ${total} habit${total !== 1 ? 's' : ''}. ${done === total ? "Amazing! All done! 🏆" : `${total - done} more to go! 💪`}`,
  motivation:  () => {
    const quotes = [
      "Small steps every day lead to big results! 🌱",
      "You don't have to be great to start, but you have to start to be great! 🚀",
      "The secret of getting ahead is getting started. ⚡",
      "Don't break the chain! 🔥",
      "Progress, not perfection. ✨",
      "Your future self is watching you right now. 👀",
      "Habits are the compound interest of self-improvement. 📈",
      "Success is the sum of small efforts repeated daily. 🏆",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },
  hello:       (name) => `Hey ${name}! 👋 I'm your Habit Tracker assistant. Ask me anything about your habits and progress!`,
  tasks:       (done, total) => total === 0
    ? "No tasks found. Add tasks inside your habits! 📋"
    : `You have ${done} completed tasks out of ${total} total tasks. Keep it up! ✅`,
  history:     () => "Check your History tab to see all your past habits and tasks with their completion status! 📜",
  default:     () => "I can help you with your habits and streaks! Try asking about your progress, streaks, or ask for motivation! 💫",
};

function getBotReply(message, state) {
  const msg   = message.toLowerCase();
  const name  = state?.user?.username || 'there';
  const habits = state?.habits || [];
  const streak = state?.streak || 0;

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return BOT_RESPONSES.hello(name);
  }
  if (msg.includes('streak')) {
    return BOT_RESPONSES.streak(streak);
  }
  if (msg.includes('habit')) {
    return BOT_RESPONSES.habits(habits.length);
  }
  if (msg.includes('progress') || msg.includes('today')) {
    const done  = habits.filter(h => h.doneToday).length;
    const total = habits.length;
    return BOT_RESPONSES.progress(done, total);
  }
  if (msg.includes('motivat') || msg.includes('inspire') || msg.includes('quote')) {
    return BOT_RESPONSES.motivation();
  }
  if (msg.includes('task')) {
    const allTasks = habits.flatMap(h => h.tasks || []);
    const done     = allTasks.filter(t => t.done).length;
    return BOT_RESPONSES.tasks(done, allTasks.length);
  }
  if (msg.includes('history') || msg.includes('past')) {
    return BOT_RESPONSES.history();
  }
  if (msg.includes('name') || msg.includes('who am i')) {
    return `You are ${name}! 😊 Keep forging those streaks!`;
  }
  if (msg.includes('help')) {
    return "I can tell you about your streaks 🔥, habits 🎯, today's progress 📊, tasks ✅, or give you motivation 💪. Just ask!";
  }
  return BOT_RESPONSES.default();
}

export default function Chatbot({ state }) {
  const [open,    setOpen]    = useState(false);
  const [messages, setMessages] = useState([
    {
      id:   1,
      from: 'bot',
      text: `Hey ${state?.user?.username || 'there'}! 👋 I'm your HabitTracker assistant. Ask me about your habits, streaks, or just say hi!`,
    }
  ]);
  const [input,   setInput]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: msg }]);

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getBotReply(msg, state);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }]);
    }, 900);
  }

  return (
    <>
  
      {open && (
        <div style={styles.window}>
          
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.botAvatar}>🤖</div>
              <div>
                <div style={styles.botName}>StreakForge AI</div>
                <div style={styles.botStatus}>
                  <div style={styles.dot} />
                  Online
                </div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div style={styles.messages}>
            {messages.map(m => (
              <div key={m.id} style={{
                ...styles.msgRow,
                flexDirection: m.from === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  ...styles.msgAvatar,
                  background: m.from === 'user'
                    ? 'linear-gradient(135deg,var(--accent),var(--accent2))'
                    : 'var(--surface2)',
                }}>
                  {m.from === 'user'
                    ? (state?.user?.username?.[0]?.toUpperCase() || 'U')
                    : '🤖'}
                </div>
                <div style={{
                  ...styles.bubble,
                  background: m.from === 'user'
                    ? 'linear-gradient(135deg,var(--accent),#9b5cf6)'
                    : 'var(--surface)',
                  color: m.from === 'user' ? '#fff' : 'var(--text)',
                  border: m.from === 'user'
                    ? 'none'
                    : '1px solid var(--border)',
                  borderBottomLeftRadius:  m.from === 'user' ? 16 : 4,
                  borderBottomRightRadius: m.from === 'user' ? 4  : 16,
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ ...styles.msgRow, flexDirection: 'row' }}>
                <div style={{ ...styles.msgAvatar, background: 'var(--surface2)' }}>🤖</div>
                <div style={{
                  ...styles.bubble,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  display: 'flex', gap: 5, alignItems: 'center',
                  padding: '12px 16px',
                }}>
                  <TypingDot delay={0} />
                  <TypingDot delay={0.2} />
                  <TypingDot delay={0.4} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={styles.quickArea}>
            <div style={styles.quickLabel}>Quick Questions</div>
            <div style={styles.quickRow}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  style={styles.quickBtn}
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={typing}
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: (!input.trim() || typing) ? 0.4 : 1,
              }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        style={{
          ...styles.toggleBtn,
          transform: open ? 'rotate(45deg) scale(1.1)' : 'rotate(0) scale(1)',
        }}
        onClick={() => setOpen(p => !p)}
        title="HabitTracker AI"
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}

function TypingDot({ delay }) {
  return (
    <div style={{
      width: 7, height: 7, borderRadius: '50%',
      background: 'var(--muted)',
      animation: `typingBounce 1s ${delay}s infinite`,
    }} />
  );
}

const styles = {
  window: {
    position: 'fixed', bottom: 94, right: 28,
    width: 360, height: 530,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
    display: 'flex', flexDirection: 'column',
    zIndex: 9998, overflow: 'hidden',
    animation: 'slideUp 0.3s cubic-bezier(.16,1,.3,1) both',
  },
  header: {
    background: 'linear-gradient(135deg,var(--accent),#9b5cf6)',
    padding: '14px 16px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  botAvatar: {
    width: 38, height: 38,
    background: 'rgba(255,255,255,0.18)',
    borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, flexShrink: 0,
  },
  botName: { color: '#fff', fontWeight: 700, fontSize: 14 },
  botStatus: {
    display: 'flex', alignItems: 'center', gap: 5,
    color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2,
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#6ee7b7', boxShadow: '0 0 6px #6ee7b7',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none',
    color: '#fff', width: 28, height: 28,
    borderRadius: 7, cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  },
  messages: {
    flex: 1, overflowY: 'auto',
    padding: '14px 14px 8px',
    display: 'flex', flexDirection: 'column', gap: 10,
    background: 'var(--bg)',
  },
  msgRow: {
    display: 'flex', alignItems: 'flex-end', gap: 7,
  },
  msgAvatar: {
    width: 26, height: 26, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, flexShrink: 0, color: '#fff', fontWeight: 700,
    border: '1px solid var(--border)',
  },
  bubble: {
    maxWidth: '78%', padding: '9px 13px',
    borderRadius: 16, fontSize: 13, lineHeight: 1.55,
    wordBreak: 'break-word',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  },
  quickArea: {
    padding: '10px 12px',
    background: 'var(--surface2)',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  quickLabel: {
    fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: 'var(--muted)', marginBottom: 6,
  },
  quickRow: {
    display: 'flex', flexWrap: 'wrap', gap: 5,
  },
  quickBtn: {
    padding: '5px 10px',
    border: '1px solid var(--border)',
    borderRadius: 20, background: 'var(--surface)',
    fontSize: 11, fontWeight: 600,
    cursor: 'pointer', color: 'var(--muted)',
    transition: 'all 0.18s', fontFamily: "'DM Sans',sans-serif",
  },
  inputArea: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '11px 13px',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)', flexShrink: 0,
  },
  input: {
    flex: 1, padding: '9px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 20, fontSize: 13,
    outline: 'none', background: 'var(--surface2)',
    color: 'var(--text)', fontFamily: "'DM Sans',sans-serif",
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--accent),#9b5cf6)',
    color: '#fff', border: 'none', cursor: 'pointer',
    fontSize: 14, transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(124,106,255,0.4)',
  },
  toggleBtn: {
    position: 'fixed', bottom: 28, right: 28,
    width: 54, height: 54, borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
    color: '#fff', fontSize: 22, border: 'none',
    cursor: 'pointer', zIndex: 9999,
    boxShadow: '0 4px 20px rgba(124,106,255,0.4)',
    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};