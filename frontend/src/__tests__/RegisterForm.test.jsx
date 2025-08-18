import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../components/RegisterForm';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('RegisterForm', () => {
  it('renders registration form fields', () => {
    render(<RegisterForm />);
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('allows typing in name, email, and password', () => {
    render(<RegisterForm />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'TestUser' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'admin' } });
  expect(screen.getByLabelText(/Username/i)).toHaveValue('TestUser');
  expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
  expect(screen.getByLabelText(/Role/i)).toHaveValue('admin');
  });
});
