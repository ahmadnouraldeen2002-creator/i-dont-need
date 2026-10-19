import { render, screen } from '@testing-library/react-native';

import PlaceholderScreen from '../../app/index';

describe('PlaceholderScreen', () => {
  it('shows the app name placeholder', async () => {
    await render(<PlaceholderScreen />);
    expect(screen.getByText('APP_NAME')).toBeOnTheScreen();
  });
});
