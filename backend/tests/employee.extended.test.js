
process.env.JWT_SECRET = 'testsecret';
const request = require('supertest');
const app = require('../server');

// Mock User and Employee models
jest.mock('../models/User', () => {
  const mockComparePassword = jest.fn();
  const mockFindOne = jest.fn();
  const mockFindById = jest.fn();
  const mockFindByIdAndUpdate = jest.fn();
  const mockFindByIdAndDelete = jest.fn();
  function User(data) {
    return {
      ...data,
      save: jest.fn().mockResolvedValue(true),
      comparePassword: mockComparePassword,
    };
  }
  User.findOne = mockFindOne;
  User.findById = mockFindById;
  User.findByIdAndUpdate = mockFindByIdAndUpdate;
  User.findByIdAndDelete = mockFindByIdAndDelete;
  User.__mockComparePassword = mockComparePassword;
  User.__mockFindOne = mockFindOne;
  User.__mockFindById = mockFindById;
  User.__mockFindByIdAndUpdate = mockFindByIdAndUpdate;
  User.__mockFindByIdAndDelete = mockFindByIdAndDelete;
  return User;
});
jest.mock('../models/Employee', () => {
  const mockFind = jest.fn();
  const mockFindById = jest.fn();
  const mockFindByIdAndUpdate = jest.fn();
  const mockFindByIdAndDelete = jest.fn();
  function Employee(data) {
    return {
      ...data,
      save: jest.fn().mockResolvedValue(true),
    };
  }
  Employee.find = mockFind;
  Employee.findById = mockFindById;
  Employee.findByIdAndUpdate = mockFindByIdAndUpdate;
  Employee.findByIdAndDelete = mockFindByIdAndDelete;
  Employee.__mockFind = mockFind;
  Employee.__mockFindById = mockFindById;
  Employee.__mockFindByIdAndUpdate = mockFindByIdAndUpdate;
  Employee.__mockFindByIdAndDelete = mockFindByIdAndDelete;
  return Employee;
});
const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// Helper to sign JWT
function signToken(payload) {
  return jwt.sign(payload, 'testsecret', { expiresIn: '1h' });
}

describe('Auth & Employee API (Extended)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/auth/me', () => {
    it('should return 401 if no token', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'No token');
    });
    it('should return user profile with valid token', async () => {
      const user = { _id: '1', username: 'test', role: 'employee', password: 'x' };
      User.findById.mockResolvedValueOnce(user);
      const token = signToken({ id: user._id, role: user.role });
      const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'test');
    });
  });

  describe('/auth/me/password', () => {
    it('should update password if old password matches', async () => {
      const user = new User({ _id: '1', username: 'test', password: 'old', role: 'employee' });
      User.findById.mockResolvedValueOnce(user);
      user.comparePassword.mockResolvedValueOnce(true);
      const token = signToken({ id: user._id, role: user.role });
      const res = await request(app)
        .put('/auth/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ oldPassword: 'old', newPassword: 'new' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Password updated');
    });
    it('should fail if old password is incorrect', async () => {
      const user = new User({ _id: '1', username: 'test', password: 'old', role: 'employee' });
      User.findById.mockResolvedValueOnce(user);
      user.comparePassword.mockResolvedValueOnce(false);
      const token = signToken({ id: user._id, role: user.role });
      const res = await request(app)
        .put('/auth/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ oldPassword: 'wrong', newPassword: 'new' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Old password incorrect');
    });
  });

  describe('/employees', () => {
    it('should return 403 for GET if not HR/Admin', async () => {
      const token = signToken({ id: '1', role: 'employee' });
      const res = await request(app).get('/employees').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
    });
    it('should return employees for HR/Admin', async () => {
      Employee.find.mockResolvedValueOnce([{ name: 'A' }, { name: 'B' }]);
      const token = signToken({ id: '1', role: 'admin' });
      const res = await request(app).get('/employees').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
    it('should create employee for HR/Admin', async () => {
      const token = signToken({ id: '1', role: 'hr' });
      const res = await request(app)
        .post('/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Emp', username: 'empuser', password: 'x', department: 'IT' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Emp');
    });
    it('should update employee for HR/Admin', async () => {
      Employee.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', name: 'Updated' });
      const token = signToken({ id: '1', role: 'admin' });
      const res = await request(app)
        .put('/employees/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated');
    });
    it('should delete employee for Admin', async () => {
      Employee.findByIdAndDelete.mockResolvedValueOnce({ _id: '1', name: 'ToDelete' });
      const token = signToken({ id: '1', role: 'admin' });
      const res = await request(app)
        .delete('/employees/1')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Employee deleted');
    });
  });
});
