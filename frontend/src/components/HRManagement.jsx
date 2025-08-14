import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLES = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR' },
  { value: 'admin', label: 'Admin' }
];

function HRManagement() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', username: '', password: '', role: 'hr' });
  const [msg, setMsg] = useState('');

  const generateUsername = () => {
    if (form.email) {
      const uname = form.email.split('@')[0];
      setForm(f => ({ ...f, username: uname }));
    }
  };
  const generatePassword = () => {
    const temp = Math.random().toString(36).slice(-8);
    setForm(f => ({ ...f, password: temp }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/create-hr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('HR user created!');
  setForm({ name: '', email: '', phone: '', department: '', username: '', password: '', role: 'hr' });
    } else {
      setMsg(data.error || 'Failed to create HR');
    }
  };

  return (
    <div className="profile-bg">
      <h2>Create HR User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onBlur={generateUsername} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
        </div>
        <div>
          <label>Department:</label>
          <input type="text" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
          <button type="button" onClick={generateUsername} style={{ marginLeft: 8 }}>Auto</button>
        </div>
        <div>
          <label>Password:</label>
          <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          <button type="button" onClick={generatePassword} style={{ marginLeft: 8 }}>Generate</button>
        </div>
        <div>
          <label>Role:</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <button type="submit">Create HR</button>
      </form>
      {msg && <div style={{ marginTop: 10, color: 'green' }}>{msg}</div>}
    </div>
  );
}

export default HRManagement;
