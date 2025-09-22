import { render, screen } from '@testing-library/react';
import AppRouter from './router/AppRouter';

test('renders app title in navbar', () => {
  render(<AppRouter />);
  const title = screen.getByText(/Recipe App/i);
  expect(title).toBeInTheDocument();
});
