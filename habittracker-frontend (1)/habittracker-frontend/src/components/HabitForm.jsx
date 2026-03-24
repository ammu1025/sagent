import { useState } from 'react';
import { today } from '../services/storage';
import { apiCreateHabit } from '../services/api';

const FREQS = ['Daily', 'Weekly', 'Monthly'];

export default function HabitForm({ onAdd, userId }) {
  const [name,    setName]    = useState('');
  const [freq,    setFreq]    = useState('Daily');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setLoading(true);

    let habitId = Date.now();

    if (userId) {
      const saved = await apiCreateHabit(name.trim(), freq, userId);
      if (saved && saved.habitId) habitId = saved.habitId;
    }

    onAdd({
      id:        habitId,
      name:      name.trim(),
      freq,
      streak:    0,
      doneToday: false,
      tasks:     [],
      createdAt: today(),
    });

    setName('');
    setFreq('Daily');
    setLoading(false);
  }

  return (
    <div className="form-card">
      <div className="form-card-title">+ Add New Habit</div>
      <div className="input-row">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Habit Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Morning Run"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Frequency</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {FREQS.map(f => (
              <span
                key={f}
                onClick={() => setFreq(f)}
                style={{
                  padding: '8px 16px', borderRadius: 50, cursor: 'pointer',
                  border: `1px solid ${freq === f ? 'var(--accent)' : 'var(--border)'}`,
                  background: freq === f ? 'rgba(124,106,255,0.15)' : 'var(--surface2)',
                  color: freq === f ? 'var(--accent)' : 'var(--muted)',
                  fontSize: 13, transition: 'all 0.2s',
                }}
              >{f}</span>
            ))}
          </div>
        </div>
      </div>
      <button className="btn-add" onClick={handleAdd} disabled={loading}>
        {loading ? 'Adding...' : 'Add Habit →'}
      </button>
    </div>
  );
}