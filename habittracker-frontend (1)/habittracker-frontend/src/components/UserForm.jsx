import { useState } from 'react';

export default function UserForm({ user, onSave }) {
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!form.username.trim() || !form.email.includes('@')) return;
    onSave?.(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="form-card">
      <div className="form-card-title">👤 Edit Profile</div>
      <div className="form-group">
        <label className="form-label">Username</label>
        <input className="form-input" type="text" value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <button className="btn-add" onClick={handleSave}>
        {saved ? '✓ Saved!' : 'Save Changes →'}
      </button>
    </div>
  );
}
