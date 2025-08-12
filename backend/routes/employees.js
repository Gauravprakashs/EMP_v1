const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();


// Middleware for role-based access
function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// GET /employees (HR, Admin)
router.get('/', requireRole('hr', 'admin'), async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});


// POST /employees (HR, Admin) - create both User and Employee
router.post('/', requireRole('hr', 'admin'), async (req, res) => {
  try {
    const { name, email, phone, department, username, password, role = 'employee', about, cvUrl } = req.body;
    // Create User for login
    const User = require('../models/User');
    let user = await User.findOne({ username: username || email });
    if (!user) {
      user = new User({ username: username || email, password: password || 'changeme', role, about, cvUrl });
      await user.save();
    }
    // Create Employee record
    const employee = new Employee({
      user: user._id,
      name,
      email,
      phone,
      department,
      about: about || '',
      cvUrl: cvUrl || ''
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /employees/:id (HR can update non-admins, Admin can update anyone)
router.put('/:id', requireRole('hr', 'admin'), async (req, res) => {
  try {
    // Only admin can update admins
    if (req.user.role === 'hr') {
      const emp = await Employee.findById(req.params.id);
      if (!emp) return res.status(404).json({ error: 'Employee not found' });
      const user = await require('../models/User').findOne({ email: emp.email });
      if (user && user.role === 'admin') {
        return res.status(403).json({ error: 'HR cannot update Admins' });
      }
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /employees/:id (Admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
