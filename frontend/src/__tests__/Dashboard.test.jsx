import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn({ employees: { list: [{ name: 'John', department: 'HR' }, { name: 'Jane', department: 'IT' }], status: 'idle', error: null } })),
  useDispatch: jest.fn(() => () => Promise.resolve()),
}));

jest.mock('../components/PieChart', () => () => <div>PieChart</div>);
jest.mock('../components/PostBoard', () => () => <div>PostBoard</div>);

describe('Dashboard', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'role') return 'admin';
          if (key === 'username') return 'adminuser';
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders PieChart and PostBoard for admin', () => {
    render(<Dashboard />);
    expect(screen.getByText(/PieChart/i)).toBeInTheDocument();
    expect(screen.getByText(/PostBoard/i)).toBeInTheDocument();
  });

  it('renders only PostBoard for employee', () => {
    window.localStorage.getItem = jest.fn((key) => (key === 'role' ? 'employee' : 'empuser'));
    render(<Dashboard />);
    expect(screen.getByText(/PostBoard/i)).toBeInTheDocument();
    expect(screen.queryByText(/PieChart/i)).not.toBeInTheDocument();
  });
});
