import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EmployeeList from '../components/EmployeeList';
import * as UIContext from '../context/UIContext';

// Mock react-redux hooks before importing the component
jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => ({ list: [], status: 'idle', error: null })),
  useDispatch: jest.fn(() => () => Promise.resolve()),
}));

describe('EmployeeList', () => {
  beforeAll(() => {
    // Mock localStorage for role
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'admin'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders Employee List heading', () => {
    // Mock useUI context
    jest.spyOn(UIContext, 'useUI').mockReturnValue({ showMessage: jest.fn() });
    render(<EmployeeList />);
    expect(screen.getByText(/employee list/i)).toBeInTheDocument();
  });
});
