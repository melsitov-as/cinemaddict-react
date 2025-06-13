import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './footer';

describe('Footer Component', () => {
  test('renders the Cinemaddict logo', () => {
    render(<Footer />);

    const logoElement = screen.getByText('Cinemaddict');

    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass('footer__logo');
    expect(logoElement).toHaveClass('logo');
    expect(logoElement).toHaveClass('logo--smaller');
  });

  test('displays "0 movies inside" when movies prop is undefined or null', () => {
    const { rerender } = render(<Footer movies={undefined} />);
    expect(screen.getByText(/0\s+movies\s+inside/i)).toBeInTheDocument();

    rerender(<Footer movies={null} />);
    expect(screen.getByText(/0\s+movies\s+inside/i)).toBeInTheDocument();
  });

  test('displays "0 movies inside" when movies array is empty', () => {
    render(<Footer movies={[]} />);
    expect(screen.getByText(/0\s+movies\s+inside/i)).toBeInTheDocument();
  });

  test('displays "1 movie inside" when there is one movie', () => {
    const singleMovie = [{ id: '1', title: 'Movie 1' }];
    render(<Footer movies={singleMovie as any} />);
    expect(screen.getByText('1 movie inside')).toBeInTheDocument();
  });

  test('displays "X movies inside" when there are multiple movies', () => {
    const multipleMovies = [
      { id: '1', title: 'Movie 1' },
      { id: '2', title: 'Movie 2' },
      { id: '3', title: 'Movie 3' },
    ];
    render(<Footer movies={multipleMovies as any} />);
    expect(screen.getByText('3 movies inside')).toBeInTheDocument();

    const manyMovies = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      title: `Movie ${i}`,
    }));
    render(<Footer movies={manyMovies as any} />);
    expect(screen.getByText('10 movies inside')).toBeInTheDocument();
  });

  test('renders the statistics section', () => {
    render(<Footer />);
    const statisticsSection = screen
      .getByText(/movies inside/i)
      .closest('section');
    expect(statisticsSection).toBeInTheDocument();
    expect(statisticsSection).toHaveClass('footer__statistics');
  });
});
