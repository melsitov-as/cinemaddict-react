import React, { useState, useEffect, JSX } from 'react';
import { Link } from 'react-router-dom';
import { MovieType } from '../film-card/film-card';
import { useAppSelector } from '../../hooks';

enum ProfileRating {
  EMPTY = "You haven't watched any movies yet.",
  NOVICE = 'Novice',
  FAN = 'Fan',
  MOVIE_BUFF = 'Movie buff',
}

const calculateWatchedMoviesCount = (
  movies: MovieType[] | null | undefined
): number => {
  if (!movies || !Array.isArray(movies)) {
    return 0;
  }
  return movies.filter((movie) => movie.isWatched).length;
};

const determineProfileRating = (moviesAmount: number): ProfileRating => {
  if (moviesAmount === 0) {
    return ProfileRating.EMPTY;
  } else if (moviesAmount > 0 && moviesAmount <= 10) {
    return ProfileRating.NOVICE;
  } else if (moviesAmount >= 11 && moviesAmount <= 20) {
    return ProfileRating.FAN;
  } else if (moviesAmount >= 21) {
    return ProfileRating.MOVIE_BUFF;
  }

  return ProfileRating.EMPTY;
};

export default function Header(): JSX.Element {
  const movies = useAppSelector((state) => state.filmCards);

  const [watchedMoviesCount, setWatchedMoviesCount] = useState<number>(
    calculateWatchedMoviesCount(movies)
  );

  useEffect(() => {
    setWatchedMoviesCount(calculateWatchedMoviesCount(movies));
  }, [movies]);

  const profileRating = determineProfileRating(watchedMoviesCount);

  return (
    <div>
      <header className='header'>
        <Link
          to='/cinemaaddict-react'
          className='header__logo-link'
          style={{ cursor: 'pointer' }}
        >
          <h1 className='header__logo logo' style={{ cursor: 'pointer' }}>
            Cinemaddict
          </h1>
        </Link>

        <section className='header__profile profile'>
          <p className='profile__rating'>{profileRating}</p>
          <img
            className='profile__avatar'
            src='images/bitmap@2x.png'
            alt='Avatar'
            width='35'
            height='35'
          />
        </section>
      </header>
    </div>
  );
}
