


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from "../slices/employeeSlice";
import EmployeeForm from "./EmployeeForm";
import { useUI } from "../context/UIContext";


function EmployeeList() {
  const dispatch = useDispatch();
  const { list: employees, status, error } = useSelector((state) => state.employees);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { showMessage } = useUI();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      showMessage("Employee deleted successfully.", "success");
    } catch {
      showMessage("Failed to delete employee.", "error");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editing) {
        await dispatch(updateEmployee({ ...editing, ...data })).unwrap();
        showMessage("Employee updated successfully.", "success");
      } else {
        await dispatch(addEmployee(data)).unwrap();
        showMessage("Employee added successfully.", "success");
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      showMessage("Failed to save employee.", "error");
    }
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
          <button className="employee-list-add-btn" onClick={handleAdd}>
            Add Employee
          </button>
        </div>
      </div>
      {showForm && (
        <EmployeeForm
          initialData={editing || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
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
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>
                  <button className="employee-list-edit-btn" onClick={() => handleEdit(emp)}>
                    Edit
                  </button>
                  <button className="employee-list-delete-btn" onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
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
