import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PostBoard from '../components/PostBoard';

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key) => {
        if (key === 'role') return 'admin';
        if (key === 'username') return 'adminuser';
        if (key === 'emp_posts') return JSON.stringify([]);
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe('PostBoard', () => {
  it('renders empty state and post form for admin', () => {
    render(<PostBoard />);
  expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
  });
});
