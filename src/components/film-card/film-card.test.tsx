import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import FilmCard, { MovieType } from './film-card';

import {
  toggleIsInFavorites,
  toggleIsInWatchlist,
  toggleIsWatched,
} from '../../store/action';
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

import * as commonUtils from '../../utils/common';
jest.mock('../../utils/common', () => ({
  getDuration: jest.fn(() => '1h 30m'),
  addStatus: jest.fn((movie: MovieType) => ({
    isInWatchlistActive: movie.isInWatchlist
      ? 'film-card__controls-item--active'
      : '',
    isWatchedActive: movie.isWatched ? 'film-card__controls-item--active' : '',
    isInFavoritesActive: movie.isInFavorites
      ? 'film-card__controls-item--active'
      : '',
  })),
}));

describe('FilmCard component', () => {
  const mockMovie: MovieType = {
    id: 1,
    title: 'Movie Title',
    rating: 8.5,
    year: '2023',
    totalDuration: 90,
    genre: ['Action', 'Sci-Fi'],
    image: 'poster.jpg',
    shortDescription: 'A thrilling sci-fi adventure.',
    commentsCount: 15,
    commentsTitle: 'Comments',
    isInWatchlist: false,
    isWatched: false,
    isInFavorites: false,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    mockOnClick.mockClear();
    (commonUtils.getDuration as jest.Mock).mockClear();
    (commonUtils.addStatus as jest.Mock).mockClear();
  });

  it('should render movie details correctly', () => {
    render(
      <MemoryRouter>
        {' '}
        <FilmCard movie={mockMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', {
      name: `View details for ${mockMovie.title}`,
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');

    expect(screen.getByText('Movie Title')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText(/Action\s*Sci-Fi/)).toBeInTheDocument();
    expect(
      screen.getByText('A thrilling sci-fi adventure.')
    ).toBeInTheDocument();
    expect(screen.getByText('15 Comments')).toBeInTheDocument();

    expect(commonUtils.getDuration).toHaveBeenCalledTimes(1);
    expect(commonUtils.getDuration).toHaveBeenCalledWith(
      mockMovie.totalDuration
    );
    expect(screen.getByText('1h 30m')).toBeInTheDocument();

    expect(commonUtils.addStatus).toHaveBeenCalledTimes(1);
    expect(commonUtils.addStatus).toHaveBeenCalledWith(mockMovie);

    const posterImage = screen.getByRole('img');
    expect(posterImage).toBeInTheDocument();
    expect(posterImage).toHaveAttribute(
      'src',
      `/cinemaaddict-react/images/posters/${mockMovie.image}`
    );
    expect(posterImage).toHaveClass('film-card__poster');
    expect(
      screen.getByRole('button', { name: /Add to watchlist/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Mark as watched/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Mark as favorite/i })
    ).toBeInTheDocument();
  });

  it('should dispatch toggleIsInWatchlist when "Add to watchlist" button is clicked', () => {
    render(
      <MemoryRouter>
        <FilmCard movie={mockMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    const addToWatchlistButton = screen.getByRole('button', {
      name: /Add to watchlist/i,
    });
    fireEvent.click(addToWatchlistButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      toggleIsInWatchlist({ id: mockMovie.id })
    );
  });

  it('should dispatch toggleIsWatched when "Mark as watched" button is clicked', () => {
    render(
      <MemoryRouter>
        <FilmCard movie={mockMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    const markAsWatchedButton = screen.getByRole('button', {
      name: /Mark as watched/i,
    });
    fireEvent.click(markAsWatchedButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      toggleIsWatched({ id: mockMovie.id })
    );
  });

  it('should dispatch toggleIsInFavorites when "Mark as favorite" button is clicked', () => {
    render(
      <MemoryRouter>
        <FilmCard movie={mockMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    const markAsFavoriteButton = screen.getByRole('button', {
      name: /Mark as favorite/i,
    });
    fireEvent.click(markAsFavoriteButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      toggleIsInFavorites({ id: mockMovie.id })
    );
  });

  it('should call onClick prop when poster is clicked', () => {
    render(
      <MemoryRouter>
        <FilmCard movie={mockMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    const posterImage = screen.getByRole('img');
    fireEvent.click(posterImage);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should apply active classes to buttons based on movie status', () => {
    const activeMovie: MovieType = {
      ...mockMovie,
      isInWatchlist: true,
      isWatched: true,
      isInFavorites: true,
    };

    render(
      <MemoryRouter>
        <FilmCard movie={activeMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    expect(commonUtils.addStatus).toHaveBeenCalledTimes(1);
    expect(commonUtils.addStatus).toHaveBeenCalledWith(activeMovie);
    expect(
      screen.getByRole('button', { name: /Add to watchlist/i })
    ).toHaveClass(
      'film-card__controls-item--add-to-watchlist',
      'film-card__controls-item--active'
    );
    expect(
      screen.getByRole('button', { name: /Mark as watched/i })
    ).toHaveClass(
      'film-card__controls-item--mark-as-watched',
      'film-card__controls-item--active'
    );
    expect(
      screen.getByRole('button', { name: /Mark as favorite/i })
    ).toHaveClass(
      'film-card__controls-item--favorite',
      'film-card__controls-item--active'
    );
  });

  it('should not apply active classes if movie status is false', () => {
    const inactiveMovie: MovieType = {
      ...mockMovie,
      isInWatchlist: false,
      isWatched: false,
      isInFavorites: false,
    };

    render(
      <MemoryRouter>
        <FilmCard movie={inactiveMovie} onClick={mockOnClick} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: /Add to watchlist/i })
    ).not.toHaveClass('film-card__controls-item--active');
    expect(
      screen.getByRole('button', { name: /Mark as watched/i })
    ).not.toHaveClass('film-card__controls-item--active');
    expect(
      screen.getByRole('button', { name: /Mark as favorite/i })
    ).not.toHaveClass('film-card__controls-item--active');
  });
});
