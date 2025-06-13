import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilmsListTitle from './films-list-title';

describe('FilmsListTitle', () => {
  test('renders the default title when no props are provided', () => {
    render(<FilmsListTitle />);
    const titleElement = screen.getByText('All movies. Upcoming');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('visually-hidden');
  });

  test('renders the provided text', () => {
    const customText = 'My Favorite Films';
    render(<FilmsListTitle text={customText} />);
    const titleElement = screen.getByText(customText);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('visually-hidden');
  });

  test('does not apply visually-hidden class when isVisible is true', () => {
    render(<FilmsListTitle isVisible={true} />);
    const titleElement = screen.getByText('All movies. Upcoming');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).not.toHaveClass('visually-hidden');
  });

  test('applies visually-hidden class when isVisible is false', () => {
    const customText = 'Upcoming movies';
    render(<FilmsListTitle text={customText} isVisible={false} />);
    const titleElement = screen.getByText(customText);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('visually-hidden');
  });

  test('renders custom text and is visible when isVisible is true', () => {
    const customText = 'Now Showing';
    render(<FilmsListTitle text={customText} isVisible={true} />);
    const titleElement = screen.getByText(customText);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).not.toHaveClass('visually-hidden');
  });
});
