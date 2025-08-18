
const request = require('supertest');
const app = require('../server');

// Mock User model for register and login
jest.mock('../models/User', () => {
  const mockComparePassword = jest.fn();
  const mockFindOne = jest.fn();
  function User(data) {
    return {
      ...data,
      save: jest.fn().mockResolvedValue(true),
      comparePassword: mockComparePassword,
    };
  }
  User.findOne = mockFindOne;
  User.__mockComparePassword = mockComparePassword;
  User.__mockFindOne = mockFindOne;
  return User;
});
const User = require('../models/User');

describe('Auth API', () => {
  beforeEach(() => {
    User.__mockComparePassword.mockReset();
    User.__mockFindOne.mockReset();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass', role: 'employee' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered');
  });

  it('should login successfully with correct credentials', async () => {
    // Mock User.findOne to return a user with correct password
    const mockUser = new User({ username: 'testuser', password: 'testpass', role: 'employee', _id: '123' });
    User.__mockComparePassword.mockResolvedValue(true);
    User.__mockFindOne.mockResolvedValueOnce(mockUser);
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role', 'employee');
  });

  it('should fail login with invalid credentials', async () => {
    // Mock User.findOne to return null (user not found)
    User.__mockFindOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'wronguser', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should fail login with wrong password', async () => {
    // Mock User.findOne to return a user but password does not match
    const mockUser = new User({ username: 'testuser', password: 'testpass', role: 'employee', _id: '123' });
    User.__mockComparePassword.mockResolvedValue(false);
    User.__mockFindOne.mockResolvedValueOnce(mockUser);
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});
