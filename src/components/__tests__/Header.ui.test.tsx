import { render, screen } from '@testing-library/react';
import { signOut } from 'next-auth/react';

import Header from '../Header';

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo and navigation link', () => {
    render(<Header />);

    const logoLink = screen.getByRole('link');
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('href')).toBe('/repositories');
    expect(screen.getByText('Devflow')).toBeTruthy();
  });

  it('should render user information when user is provided', () => {
    const user = {
      name: 'John Doe',
      image: 'https://example.com/avatar.jpg',
      username: 'johndoe',
    };

    render(<Header user={user} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeTruthy();
  });

  it('should call signOut when sign out button is clicked', () => {
    const user = {
      name: 'Test User',
      image: null,
      username: 'testuser',
    };

    render(<Header user={user} />);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    signOutButton.click();

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
