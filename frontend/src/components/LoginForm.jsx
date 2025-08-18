import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hr");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (onLogin) onLogin();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h3 className="employee-form-title">Login</h3>
      <div className="employee-form-group">
        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="employee-form-input"
          required
        />
      </div>
      <div className="employee-form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="employee-form-input"
          required
        />
      </div>
      {error && <p className="employee-form-error">{error}</p>}
      <div className="employee-form-actions">
        <button type="submit" className="employee-form-submit">Login</button>
      </div>
    </form>
  );
}

export default LoginForm;
