import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from "../slices/employeeSlice";
import EmployeeForm from "./EmployeeForm";
import { useUI } from "../context/UIContext";


const ROLES = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR' }
];

function EmployeeList() {
  const dispatch = useDispatch();
  const { list: employees, status, error } = useSelector((state) => state.employees);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [empForm, setEmpForm] = useState({ name: '', email: '', phone: '', department: '', username: '', password: '', role: 'employee' });
  const { showMessage } = useUI();
  // Filter: show all employees and HRs (and admins for admin view)
  const role = localStorage.getItem("role");
  let filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(filter.toLowerCase())
  );
  // Optionally, show admins for admin view
  // if (role === "admin") filteredEmployees = employees;
  // else filteredEmployees = employees.filter(emp => emp.role !== "admin");

  useEffect(() => {
    if (role === "admin" || role === "hr") {
      dispatch(fetchEmployees());
    }
  }, [dispatch, role]);

  if (role !== "admin" && role !== "hr") {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Forbidden: You do not have access to this page.</div>;
  }

  // UI triggers
  const handleAddClick = () => {
    setEditing(null);
    setShowForm(true);
  };
  const handleEditClick = (emp) => {
    setEditing(emp);
    setShowForm(true);
  };

  // Async actions
  const handleDelete = async (id) => {
    await dispatch(deleteEmployee(id)).unwrap();
    dispatch(fetchEmployees()); // Refresh list after delete
  };
  const handleEdit = async (data) => {
    await dispatch(updateEmployee({ ...editing, ...data })).unwrap();
    setEditing(null);
    dispatch(fetchEmployees()); // Refresh list after update
  };
  const handleAdd = async (data) => {
    await dispatch(addEmployee(data)).unwrap();
    setShowForm(false);
    dispatch(fetchEmployees()); // Refresh list after add
  };

  const generateUsername = () => {
    if (empForm.email) {
      const uname = empForm.email.split('@')[0];
      setEmpForm(f => ({ ...f, username: uname }));
    }
  };
  const generatePassword = () => {
    const temp = Math.random().toString(36).slice(-8);
    setEmpForm(f => ({ ...f, password: temp }));
  };

  return (
    <div className="employee-list-bg">
      <div className="employee-list-header">
        <h3 className="employee-list-title">Employee List</h3>
        <div className="employee-list-controls">
          <input
            type="text"
            placeholder="Filter by name..."
            className="employee-list-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {(role === "admin" || role === "hr") && (
            <button className="employee-list-add-btn" onClick={() => setShowForm(true)}>
              Add Employee
            </button>
          )}
        </div>
      </div>
      {showForm && (
        <form className="employee-form" onSubmit={async (e) => { e.preventDefault(); await handleAdd(empForm); setEmpForm({ name: '', email: '', phone: '', department: '', username: '', password: '', role: 'employee' }); setShowForm(false); }}>
          <h3 className="employee-form-title">Add Employee</h3>
          <div className="employee-form-group">
            <label>Name</label>
            <input type="text" value={empForm.name} onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="employee-form-group">
            <label>Email</label>
            <input type="email" value={empForm.email} onChange={e => setEmpForm(f => ({ ...f, email: e.target.value }))} onBlur={generateUsername} required />
          </div>
          <div className="employee-form-group">
            <label>Phone</label>
            <input type="text" value={empForm.phone} onChange={e => setEmpForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div className="employee-form-group">
            <label>Department</label>
            <input type="text" value={empForm.department} onChange={e => setEmpForm(f => ({ ...f, department: e.target.value }))} required />
          </div>
          <div className="employee-form-group">
            <label>Username</label>
            <input type="text" value={empForm.username} onChange={e => setEmpForm(f => ({ ...f, username: e.target.value }))} required />
            <button type="button" onClick={generateUsername} style={{ marginLeft: 8 }}>Auto</button>
          </div>
          <div className="employee-form-group">
            <label>Temporary Password</label>
            <input type="text" value={empForm.password} onChange={e => setEmpForm(f => ({ ...f, password: e.target.value }))} required />
            <button type="button" onClick={generatePassword} style={{ marginLeft: 8 }}>Generate</button>
          </div>
          <div className="employee-form-group">
            <label>Role</label>
            <select value={empForm.role} onChange={e => setEmpForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="employee-form-actions">
            <button type="submit" className="employee-form-submit">Add</button>
            <button type="button" className="employee-form-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="employee-list-table-wrapper">
        <table className="employee-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp._id || emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>
                  <button className="employee-list-edit-btn" onClick={() => handleEditClick(emp)}>
                    Edit
                  </button>
                  {role === "admin" && (
                    <button className="employee-list-delete-btn" onClick={() => handleDelete(emp._id || emp.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="employee-list-empty">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {status === 'loading' && <p className="employee-list-loading">Loading...</p>}
      {error && <p className="employee-list-error">{error}</p>}
    </div>
  );
}

export default EmployeeList;
