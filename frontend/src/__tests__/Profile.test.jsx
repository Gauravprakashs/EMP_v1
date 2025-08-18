
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';

beforeAll(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      username: 'TestUser',
      role: 'employee',
      about: 'About me',
      cvUrl: 'http://cv.url',
    }),
  }));
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => 'token'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe('Profile', () => {
  it('renders user profile details', async () => {
    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText(/TestUser/i)).toBeInTheDocument();
      expect(screen.getByText(/EMPLOYEE/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/About me/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/http:\/\/cv.url/i)).toBeInTheDocument();
    });
  });
});
