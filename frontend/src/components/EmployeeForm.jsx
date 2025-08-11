import React, { useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  department: "",
};

function EmployeeForm({ initialData = initialState, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email format.";
  if (!form.phone.trim()) errs.phone = "Phone is required.";
  else if (!/^\d{10}$/.test(form.phone)) errs.phone = "Phone must be exactly 10 digits.";
    if (!form.department.trim()) errs.department = "Department is required.";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      onSubmit(form);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h3 className="employee-form-title">{initialData.id ? "Edit" : "Add"} Employee</h3>
      <div className="employee-form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          className="employee-form-input"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="employee-form-error">{errors.name}</p>}
      </div>
      <div className="employee-form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="employee-form-input"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="employee-form-error">{errors.email}</p>}
      </div>
      <div className="employee-form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          className="employee-form-input"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter 10 digit phone number"
          maxLength={10}
        />
        {errors.phone && <p className="employee-form-error">{errors.phone}</p>}
      </div>
      <div className="employee-form-group">
        <label>Department</label>
        <input
          type="text"
          name="department"
          className="employee-form-input"
          value={form.department}
          onChange={handleChange}
        />
        {errors.department && <p className="employee-form-error">{errors.department}</p>}
      </div>
      <div className="employee-form-actions">
        <button type="submit" className="employee-form-submit">
          {initialData.id ? "Update" : "Add"}
        </button>
        {onCancel && (
          <button type="button" className="employee-form-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default EmployeeForm;
