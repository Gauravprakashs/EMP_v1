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
          <button className="employee-list-add-btn" onClick={handleAddClick}>
            Add Employee
          </button>
        </div>
      </div>
      {showForm && (
        <EmployeeForm
          initialData={editing || undefined}
          onSubmit={editing ? handleEdit : handleAdd}
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
              <tr key={emp._id || emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>
                  <button className="employee-list-edit-btn" onClick={() => handleEditClick(emp)}>
                    Edit
                  </button>
                  <button className="employee-list-delete-btn" onClick={() => handleDelete(emp._id || emp.id)}>
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
