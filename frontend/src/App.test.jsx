import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./services/api', () => ({
  projectAPI: {
    getOpen: () => Promise.resolve({ data: [] }),
  },
}));

test('renders marketplace navigation', () => {
  render(<App />);
  expect(screen.getByText(/FreelanceHub/i)).toBeInTheDocument();
});
