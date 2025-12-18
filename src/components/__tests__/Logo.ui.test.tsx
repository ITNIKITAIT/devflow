import { render, screen } from '@testing-library/react';

import Logo from '../Logo';

describe('Logo Component', () => {
  it('should render logo with text by default', () => {
    render(<Logo />);

    expect(screen.getByText('Devflow')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
  });

  it('should render logo without text when showText is false', () => {
    render(<Logo showText={false} />);

    expect(screen.queryByText('Devflow')).toBeNull();
    expect(screen.getByText('D')).toBeTruthy();
  });
});
