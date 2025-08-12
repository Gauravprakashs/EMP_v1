import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, NavLink } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import Dashboard from "./components/Dashboard";
import PostBoard from "./components/PostBoard";
import Profile from "./components/Profile";
import HRManagement from "./components/HRManagement";

function RoleProtectedRoute({ allowedRoles, children }) {
  const role = localStorage.getItem("role");
  if (!allowedRoles.includes(role)) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Forbidden: You do not have access to this page.</div>;
  }
  return children;
}

function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token"));
  const [role, setRole] = React.useState(localStorage.getItem("role"));
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    window.location.href = "/login";
  };

  React.useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [isLoggedIn]);

  const showNavLinks = isLoggedIn && !["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-bg">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <span className="navbar-title">Employee Directory</span>
          {showNavLinks && (
            <div className="navbar-links">
              <NavLink to="/" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"} end>Dashboard</NavLink>
              <NavLink to="/employees" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>Employees</NavLink>
              <NavLink to="/post" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>Post</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>My Profile</NavLink>
              <button className="employee-form-cancel" onClick={handleLogout} style={{ marginLeft: '1rem' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<RegisterForm onRegister={() => window.location.href = '/login'} />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={["admin", "hr"]}><EmployeeList /></RoleProtectedRoute></ProtectedRoute>} />
          <Route path="/employee/new" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={["admin", "hr"]}><EmployeeForm /></RoleProtectedRoute></ProtectedRoute>} />
          <Route path="/employee/:id" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={["admin", "hr"]}><EmployeeForm /></RoleProtectedRoute></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute><PostBoard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
        </Routes>
        {/* Register link on login page */}
        {!isLoggedIn && location.pathname === "/login" && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span>Don't have an account? </span>
            <a href="/register" style={{ color: '#39eb25', textDecoration: 'underline' }}>Register</a>
          </div>
        )}
      </main>
    </div>
  );
}

function AppRouterWithRouter() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default AppRouterWithRouter;
