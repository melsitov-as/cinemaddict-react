import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShowMoreButton from './show-more-button';

describe('ShowMoreButton Component', () => {
  let handleClick: jest.Mock;

  beforeEach(() => {
    handleClick = jest.fn();
  });

  test('renders with "Show more" text', () => {
    render(<ShowMoreButton onClick={handleClick} />);

    const showMoreButton = screen.getByText('Show more');

    expect(showMoreButton).toBeInTheDocument();

    expect(showMoreButton).toBeInstanceOf(HTMLButtonElement);
    expect(showMoreButton).toHaveClass('films-list__show-more');
  });

  test('calls onClick handler when clicked', () => {
    render(<ShowMoreButton onClick={handleClick} />);

    const showMoreButton = screen.getByText('Show more');

    fireEvent.click(showMoreButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick handler multiple times when clicked multiple times', () => {
    render(<ShowMoreButton onClick={handleClick} />);

    const showMoreButton = screen.getByText('Show more');

    fireEvent.click(showMoreButton);
    fireEvent.click(showMoreButton);
    fireEvent.click(showMoreButton);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
