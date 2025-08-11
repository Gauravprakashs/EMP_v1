
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";

function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token"));
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <div className="app-bg">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <span className="navbar-title">Employee Directory</span>
          {isLoggedIn && (
            <button className="employee-form-cancel" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<RegisterForm onRegister={() => window.location.href = '/login'} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/new"
            element={
              <ProtectedRoute>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/:id"
            element={
              <ProtectedRoute>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />
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
