import { useState } from 'react'
import styles from './LoginPage.module.css'
import { apiLogin, apiRegister } from '../services/api'

export default function LoginPage({ state, updateState, showToast }) {
  const [mode,     setMode]     = useState('login')
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  const maxStreak = (state?.habits || []).reduce((m, h) => Math.max(m, h.streak), 0)
  const done      = (state?.tasks  || []).filter(t => t.done).length +
                    (state?.habits || []).filter(h => h.doneToday).length

  function clearFields() { setUsername(''); setEmail(''); setPassword('') }
  function switchMode(m) { setMode(m); clearFields() }

  async function handleLogin() {
    if (!username.trim()) { showToast('warn', '⚠️ Missing', 'Please enter your username.'); return }
    if (!password)        { showToast('warn', '⚠️ Missing', 'Please enter your password.');  return }

    setLoading(true)
    const res = await apiLogin(username.trim(), password)
    setLoading(false)

    console.log('Login response:', res)

    if (!res.success) {
      showToast('warn', '❌ Login Failed', res.message || 'Invalid username or password.')
      return
    }

    const saved = JSON.parse(localStorage.getItem(`sf_data_${res.username}`) || 'null')

    updateState(saved ? {
      ...saved,
      user: {
        userId:   res.userId,
        username: res.username,
        email:    res.email,
      }
    } : {
      user: {
        userId:   res.userId,
        username: res.username,
        email:    res.email,
      },
      habits:  [],
      tasks:   [],
      history: [],
      streak:  0,
    })

    showToast('success', '🔥 Welcome back!', `Good to see you, ${res.username}!`)
  }

  async function handleSignup() {
    if (!username.trim()) { showToast('warn', '⚠️ Missing', 'Please enter a username.');        return }
    if (!email.trim() || !email.includes('@')) { showToast('warn', '⚠️ Invalid Email', 'Enter a valid email.'); return }
    if (password.length < 4) { showToast('warn', '⚠️ Weak Password', 'Min 4 characters.');     return }

    setLoading(true)
    const res = await apiRegister(username.trim(), email.trim(), password)
    setLoading(false)

    console.log('Register response:', res)

    if (!res.success) {
      showToast('warn', '❌ Account Exists', res.message + ' Please Login instead.')
      return
    }

    updateState({
      user: {
        userId:   res.userId,
        username: res.username,
        email:    res.email,
      },
      habits:  [],
      tasks:   [],
      history: [],
      streak:  0,
    })

    showToast('success', '🎉 Account Created!', `Welcome, ${res.username}! You are now saved in the database!`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ animation: 'slideUp 0.6s cubic-bezier(.16,1,.3,1) both' }}>

        <div className={styles.logoMark}>
          <div className={styles.logoIcon}>🔥</div>
          <div className={styles.logoText}>Habit<span>Tracker</span></div>
        </div>

        <div className={styles.modeTabs}>
          <button
            className={mode === 'login' ? styles.modeTabActive : styles.modeTab}
            onClick={() => switchMode('login')}
          >Login</button>
          <button
            className={mode === 'signup' ? styles.modeTabActive : styles.modeTab}
            onClick={() => switchMode('signup')}
          >Sign Up</button>
        </div>

        <h1 className={styles.title}>
          {mode === 'login' ? 'Welcome back 👋' : 'Create account ✨'}
        </h1>
        <p className={styles.sub}>
          {mode === 'login'
            ? 'Login to continue your streak journey.'
            : 'Sign up and start building habits today.'}
        </p>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            placeholder="your_name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
          />
        </div>
        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
          />
        </div>

        <button
          className="btn-primary"
          disabled={loading}
          onClick={mode === 'login' ? handleLogin : handleSignup}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login & Continue →' : 'Create Account →'}
        </button>

        <div className={styles.switchRow}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <span className={styles.switchLink} onClick={() => switchMode('signup')}>Sign Up</span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span className={styles.switchLink} onClick={() => switchMode('login')}>Login</span>
            </>
          )}
        </div>
      </div>

      {mode === 'login' && (
        <div className={styles.statusBar} style={{ animation: 'slideUp 0.7s 0.1s cubic-bezier(.16,1,.3,1) both' }}>
          <div className={styles.statusCard}>
            <div className={styles.statItem}>
              <span className={styles.statValFire}>{maxStreak}🔥</span>
              <span className={styles.statLabel}>Best Streak</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.statItem}>
              <span className={styles.statValGreen}>{done}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.statItem}>
              <span className={styles.statValPurple}>{(state?.habits || []).length}</span>
              <span className={styles.statLabel}>Habits</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.statItem}>
              <span className={styles.statValPink}>{(state?.tasks || []).length}</span>
              <span className={styles.statLabel}>Tasks</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <div className={styles.statusBar} style={{ animation: 'slideUp 0.7s 0.1s cubic-bezier(.16,1,.3,1) both' }}>
          <div className={styles.hintCard}>
            <div className={styles.hintIcon}>💡</div>
            <div className={styles.hintText}>
              New accounts start fresh with <strong>0 streaks</strong>. Build your first habit to get started!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}