import { useState } from 'react';
import { today, apiSaveTask } from '../services/storage';

export default function TaskForm({ onAdd }) {
  const [title,   setTitle]   = useState('');
  const [desc,    setDesc]    = useState('');
  const [due,     setDue]     = useState(today());
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  function handleAdd() {
    if (!title.trim() || !due) return;

    const totalSeconds =
      (parseInt(minutes || '0', 10) * 60) + parseInt(seconds || '0', 10);

    const task = {
      id: Date.now(),
      title: title.trim(),
      desc: desc.trim(),
      due,
      done: false,
      createdAt: today(),
      timerDuration:  totalSeconds,
      timerRemaining: totalSeconds,
      timerRunning:   false,
    };

    apiSaveTask(task);
    onAdd(task);
    setTitle('');
    setDesc('');
    setDue(today());
    setMinutes('');
    setSeconds('');
  }

  return (
    <div className="form-card">
      <div className="form-card-title">+ Create New Task</div>

      <div className="form-group">
        <label className="form-label">Task Title</label>
        <input className="form-input" type="text" placeholder="e.g. Read 10 pages"
          value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()} />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <input className="form-input" type="text" placeholder="Short description (optional)"
          value={desc} onChange={e => setDesc(e.target.value)} />
      </div>

      <div className="input-row">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Due Date</label>
          <input className="form-input" type="date"
            value={due} onChange={e => setDue(e.target.value)} />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">⏱ Timer (optional)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              className="form-input"
              type="number" min="0" max="999"
              placeholder="mm"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              style={{ textAlign: 'center' }}
            />
            <span style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 18 }}>:</span>
            <input
              className="form-input"
              type="number" min="0" max="59"
              placeholder="ss"
              value={seconds}
              onChange={e => setSeconds(e.target.value)}
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>
      </div>

      <button className="btn-add" onClick={handleAdd}>Create Task →</button>
    </div>
  );
}