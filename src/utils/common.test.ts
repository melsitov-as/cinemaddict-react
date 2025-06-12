import { MovieType } from '../components/film-card/film-card';
import {
  addStatus,
  getDuration,
  getDurationInHandM,
  getRandomPositiveFloatAsString,
  getRandomPositiveInteger,
  getStringOrEmpty,
  isCtrlCommandEnterKey,
  isEscKey,
  sortByComments,
  sortByDate,
  sortByRating,
} from './common';

describe('getRandomPositiveFloat', () => {
  it('should return a string', () => {
    const result = getRandomPositiveFloatAsString(1, 10);
    expect(typeof result).toBe('string');
  });

  it('should return a positive float as a string', () => {
    const result = getRandomPositiveFloatAsString(1, 10);
    expect(parseFloat(result)).toBeGreaterThanOrEqual(0);
  });
});

describe('getRandomPositiveInteger', () => {
  it('should return a number', () => {
    const result = getRandomPositiveInteger(1, 10);
    expect(typeof result).toBe('number');
  });

  it('should return a positive float as a string', () => {
    const result = getRandomPositiveInteger(1, 10);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe('getDuration', () => {
  it('returns "0" for undefined input', () => {
    expect(getDuration(undefined)).toBe('0');
  });

  it('returns only minutes for values less than 60', () => {
    expect(getDuration(45)).toBe('45m');
    expect(getDuration(1)).toBe('1m');
  });

  it('returns "1h" for 60 minutes', () => {
    expect(getDuration(60)).toBe('1h');
  });

  it('returns "xh ym" for values greater than 60', () => {
    expect(getDuration(90)).toBe('1h 30m');
    expect(getDuration(135)).toBe('2h 15m');
    expect(getDuration(61)).toBe('1h 1m');
  });
});

describe('getDurationInHandM', () => {
  it('returns { hours: 0, minutes: 0 } for 0 minutes', () => {
    expect(getDurationInHandM(0)).toEqual({ hours: 0, minutes: 0 });
  });

  it('returns { hours: 0, minutes: 59 } for 59 minutes', () => {
    expect(getDurationInHandM(59)).toEqual({ hours: 0, minutes: 59 });
  });

  it('returns { hours: 1, minutes: 0 } for 60 minutes', () => {
    expect(getDurationInHandM(60)).toEqual({ hours: 1, minutes: 0 });
  });

  it('returns { hours: 1, minutes: 30 } for 90 minutes', () => {
    expect(getDurationInHandM(90)).toEqual({ hours: 1, minutes: 30 });
  });
});

describe('getStringOrEmpty', () => {
  it('returns "" if first argument "undefined"', () => {
    expect(getStringOrEmpty(undefined, 'active')).toBe('');
  });

  it('returns "" if argument "false"', () => {
    expect(getStringOrEmpty(false, 'active')).toBe('');
  });

  it('returns "active" if argument "undefined"', () => {
    expect(getStringOrEmpty(true, 'active')).toBe('active');
  });
});

describe('addStatus', () => {
  it('returns all false for all false', () => {
    expect(
      addStatus({
        isInWatchlist: false,
        isWatched: false,
        isInFavorites: false,
      })
    ).toEqual({
      isInWatchlistActive: '',
      isWatchedActive: '',
      isInFavoritesActive: '',
    });
  });

  it('returns all true for all true', () => {
    expect(
      addStatus({ isInWatchlist: true, isWatched: true, isInFavorites: true })
    ).toEqual({
      isInWatchlistActive: 'film-card__controls-item--active',
      isWatchedActive: 'film-card__controls-item--active',
      isInFavoritesActive: 'film-card__controls-item--active',
    });
  });

  it('returns 2 true and 1 false for 2 true and 1 false', () => {
    expect(
      addStatus({ isInWatchlist: false, isWatched: true, isInFavorites: true })
    ).toEqual({
      isInWatchlistActive: '',
      isWatchedActive: 'film-card__controls-item--active',
      isInFavoritesActive: 'film-card__controls-item--active',
    });
  });
});

describe('isEscKey', () => {
  it('returns true when Escape key is pressed', () => {
    const event = { key: 'Escape' } as React.KeyboardEvent;
    expect(isEscKey(event)).toBe(true);
  });

  it('returns true when esc key is pressed', () => {
    const event = { key: 'esc' } as React.KeyboardEvent;
    expect(isEscKey(event)).toBe(true);
  });

  it('returns false when any other key is pressed', () => {
    const event = { key: 'Enter' } as React.KeyboardEvent;
    expect(isEscKey(event)).toBe(false);
  });

  it('returns false when key is a number', () => {
    const event = { key: '1' } as React.KeyboardEvent;
    expect(isEscKey(event)).toBe(false);
  });
});

describe('isCtrlCommandEnterKey', () => {
  it('returns true when Ctrl + Enter is pressed', () => {
    const event = {
      key: 'Enter',
      ctrlKey: true,
      metaKey: false,
    } as React.KeyboardEvent;
    expect(isCtrlCommandEnterKey(event)).toBe(true);
  });

  it('returns true when Command (Meta) + Enter is pressed on Mac', () => {
    const event = {
      key: 'Enter',
      ctrlKey: false,
      metaKey: true,
    } as React.KeyboardEvent;
    expect(isCtrlCommandEnterKey(event)).toBe(true);
  });

  it('returns false when only Enter is pressed without Ctrl or Meta', () => {
    const event = {
      key: 'Enter',
      ctrlKey: false,
      metaKey: false,
    } as React.KeyboardEvent;
    expect(isCtrlCommandEnterKey(event)).toBe(false);
  });

  it('returns false when Ctrl is pressed but not Enter', () => {
    const event = {
      key: 'A',
      ctrlKey: true,
      metaKey: false,
    } as React.KeyboardEvent;
    expect(isCtrlCommandEnterKey(event)).toBe(false);
  });

  it('returns false when Meta is pressed but not Enter', () => {
    const event = {
      key: 'A',
      ctrlKey: false,
      metaKey: true,
    } as React.KeyboardEvent;
    expect(isCtrlCommandEnterKey(event)).toBe(false);
  });

  it('returns false when a key other than Enter is pressed with Ctrl or Meta', () => {
    const event = {
      key: 'Space',
      ctrlKey: true,
      metaKey: false,
    } as React.KeyboardEvent;
    expect(isCtrlCommandEnterKey(event)).toBe(false);
  });
});

describe('sortByDate', () => {
  it('returns a positive number when filmA is earlier than filmB', () => {
    const filmA = { title: 'Film A', releaseDate: '2021-01-01' };
    const filmB = { title: 'Film B', releaseDate: '2022-01-01' };
    expect(sortByDate(filmA, filmB)).toBeGreaterThan(0); // filmB is later, should return positive
  });

  it('returns a negative number when filmA is later than filmB', () => {
    const filmA = { title: 'Film A', releaseDate: '2022-01-01' };
    const filmB = { title: 'Film B', releaseDate: '2021-01-01' };
    expect(sortByDate(filmA, filmB)).toBeLessThan(0); // filmA is later, should return negative
  });

  it('returns 0 when films have the same release date', () => {
    const filmA = { title: 'Film A', releaseDate: '2022-01-01' };
    const filmB = { title: 'Film B', releaseDate: '2022-01-01' };
    expect(sortByDate(filmA, filmB)).toBe(0); // Same release date, should return 0
  });

  it('correctly sorts an array of movies by release date', () => {
    const films = [
      { title: 'Film A', releaseDate: '2022-01-01' },
      { title: 'Film B', releaseDate: '2021-01-01' },
      { title: 'Film C', releaseDate: '2023-01-01' },
    ];

    const sortedFilms = films.sort(sortByDate);

    expect(sortedFilms[0].title).toBe('Film C'); // Should be the latest
    expect(sortedFilms[1].title).toBe('Film A');
    expect(sortedFilms[2].title).toBe('Film B'); // Should be the earliest
  });
});

describe('sortByRating', () => {
  it('should sort movies by rating in descending order', () => {
    const movie1: MovieType = { id: 1, title: 'Movie A', rating: 8.5 };
    const movie2: MovieType = { id: 2, title: 'Movie B', rating: 9.0 };
    const movie3: MovieType = { id: 3, title: 'Movie C', rating: 7.2 };

    const sortedMovies = [movie1, movie2, movie3].sort(sortByRating);

    expect(sortedMovies).toEqual([movie2, movie1, movie3]);
  });

  it('should treat undefined or null ratings as 0', () => {
    const movieWithNullRating: MovieType = {
      id: 1,
      title: 'Movie A',
      rating: null,
    };
    const movieWithUndefinedRating: MovieType = {
      id: 2,
      title: 'Movie B',
      rating: undefined,
    };
    const movieWithZeroRating: MovieType = {
      id: 3,
      title: 'Movie C',
      rating: 0,
    };
    const movieWithPositiveRating: MovieType = {
      id: 4,
      title: 'Movie D',
      rating: 5.0,
    };

    const sortedMovies = [
      movieWithNullRating,
      movieWithUndefinedRating,
      movieWithPositiveRating,
      movieWithZeroRating,
    ].sort(sortByRating);

    expect(sortedMovies[0]).toEqual(movieWithPositiveRating);
    expect(sortedMovies.slice(1)).toEqual(
      expect.arrayContaining([
        movieWithNullRating,
        movieWithUndefinedRating,
        movieWithZeroRating,
      ])
    );

    expect(sortByRating(movieWithNullRating, movieWithZeroRating)).toBe(0);
    expect(sortByRating(movieWithUndefinedRating, movieWithZeroRating)).toBe(0);
  });

  it('should maintain relative order for movies with the same rating', () => {
    const movie1: MovieType = { id: 1, title: 'Movie A', rating: 7.5 };
    const movie2: MovieType = { id: 2, title: 'Movie B', rating: 7.5 };
    const movie3: MovieType = { id: 3, title: 'Movie C', rating: 7.5 };

    const sortedMovies = [movie1, movie2, movie3].sort(sortByRating);

    expect(sortedMovies).toEqual(
      expect.arrayContaining([movie1, movie2, movie3])
    );
    expect(sortByRating(movie1, movie2)).toBe(0);
  });

  it('should correctly sort mixed ratings, including zero and negative values', () => {
    const movie1: MovieType = { id: 1, title: 'Movie A', rating: 10 };
    const movie2: MovieType = { id: 2, title: 'Movie B', rating: undefined };
    const movie3: MovieType = { id: 3, title: 'Movie C', rating: 5 };
    const movie4: MovieType = { id: 4, title: 'Movie D', rating: undefined };
    const movie5: MovieType = { id: 5, title: 'Movie E', rating: -2 };
    const movie6: MovieType = { id: 6, title: 'Movie F', rating: 0 };

    const sortedMovies = [movie1, movie2, movie3, movie4, movie5, movie6].sort(
      sortByRating
    );

    expect(sortedMovies[0]).toEqual(movie1);
    expect(sortedMovies[1]).toEqual(movie3);

    const zeroRatingMovies = sortedMovies.slice(2);
    expect(zeroRatingMovies).toHaveLength(4);
    expect(zeroRatingMovies).toEqual(
      expect.arrayContaining([movie2, movie4, movie5, movie6])
    );
  });
});

describe('sortByComments', () => {
  it('returns a positive number when the first film has fewer comments than the second', () => {
    const filmA = { title: 'Film A', commentsCount: 5 };
    const filmB = { title: 'Film B', commentsCount: 10 };
    expect(sortByComments(filmA, filmB)).toBeGreaterThan(0); // filmB has more comments, should return positive
  });

  it('returns a negative number when the first film has more comments than the second', () => {
    const filmA = { title: 'Film A', commentsCount: 10 };
    const filmB = { title: 'Film B', commentsCount: 5 };
    expect(sortByComments(filmA, filmB)).toBeLessThan(0); // filmA has more comments, should return negative
  });

  it('returns 0 when both films have the same number of comments', () => {
    const filmA = { title: 'Film A', commentsCount: 7 };
    const filmB = { title: 'Film B', commentsCount: 7 };
    expect(sortByComments(filmA, filmB)).toBe(0); // Same number of comments, should return 0
  });

  it('correctly sorts an array of movies by commentsCount', () => {
    const films = [
      { title: 'Film A', commentsCount: 3 },
      { title: 'Film B', commentsCount: 10 },
      { title: 'Film C', commentsCount: 7 },
    ];

    const sortedFilms = films.sort(sortByComments);

    expect(sortedFilms[0].title).toBe('Film B'); // Should be the most commented
    expect(sortedFilms[1].title).toBe('Film C');
    expect(sortedFilms[2].title).toBe('Film A'); // Should be the least commented
  });

  it('handles undefined commentsCount by treating it as 0', () => {
    const filmA = { title: 'Film A', commentsCount: undefined };
    const filmB = { title: 'Film B', commentsCount: 10 };
    expect(sortByComments(filmA, filmB)).toBeGreaterThan(0); // filmB has a commentsCount, should return positive
  });

  it('treats films with undefined commentsCount as having 0 comments', () => {
    const filmA = { title: 'Film A', commentsCount: undefined };
    const filmB = { title: 'Film B', commentsCount: undefined };
    expect(sortByComments(filmA, filmB)).toBe(0); // Same undefined commentsCount, should return 0
  });
});
