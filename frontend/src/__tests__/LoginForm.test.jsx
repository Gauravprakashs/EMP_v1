import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('LoginForm', () => {
  it('renders login form fields', () => {
    render(<LoginForm />);
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('allows typing in email and password', () => {
    render(<LoginForm />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
  expect(screen.getByLabelText(/Username/i)).toHaveValue('testuser');
  expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
  });
});
