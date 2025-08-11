import React, { useState } from "react";

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hr");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess("Registration successful! Please login.");
      setTimeout(() => {
        if (onRegister) onRegister();
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h3 className="employee-form-title">Register</h3>
      <div className="employee-form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="employee-form-input"
          required
        />
      </div>
      <div className="employee-form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="employee-form-input"
          required
        />
      </div>
      <div className="employee-form-group">
        <label>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="employee-form-input"
        >
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <p className="employee-form-error">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className="employee-form-actions">
        <button type="submit" className="employee-form-submit">Register</button>
      </div>
    </form>
  );
}

export default RegisterForm;
