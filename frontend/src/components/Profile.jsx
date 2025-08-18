import React, { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ about: '', cvUrl: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data); 
      setForm({ about: data.about || '', cvUrl: data.cvUrl || '' });
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setProfile(data);
      setEdit(false);
      setMsg('Profile updated!');
    } else {
      setMsg(data.error || 'Update failed');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/auth/me/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(passwords),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Password updated!');
      setPasswords({ oldPassword: '', newPassword: '' });
    } else {
      setMsg(data.error || 'Password update failed');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-bg refined-profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{profile.username?.charAt(0).toUpperCase() || '?'}</span>
        </div>
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <div className="profile-role">{profile.role?.toUpperCase()}</div>
        </div>
      </div>
      <form className="profile-form" onSubmit={handleUpdate}>
        <div className="profile-section-title">About / Bio</div>
        <textarea className="profile-textarea" value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} placeholder="Tell us about yourself..." />
        <div className="profile-section-title">CV URL</div>
        <input className="profile-input" type="text" value={form.cvUrl} onChange={e => setForm(f => ({ ...f, cvUrl: e.target.value }))} placeholder="Paste your CV link here..." />
        <button className="profile-btn" type="submit">Update Profile</button>
      </form>
      <form className="profile-form" onSubmit={handlePassword}>
        <div className="profile-section-title">Change Password</div>
        <input className="profile-input" type="password" value={passwords.oldPassword} onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))} placeholder="Old Password" />
        <input className="profile-input" type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} placeholder="New Password" />
        <button className="profile-btn" type="submit">Change Password</button>
      </form>
      {msg && <div className="profile-msg">{msg}</div>}
    </div>
  );
}

export default Profile;
