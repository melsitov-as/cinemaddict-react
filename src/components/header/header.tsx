import React, { useState, useEffect, JSX } from 'react';
import { Link } from 'react-router-dom';
import { MovieType } from '../film-card/film-card';

type HeaderProps = {
  movies?: MovieType[] | null | undefined;
};

enum ProfileRating {
  EMPTY = '',
  NOVICE = 'novice',
  FAN = 'fan',
  MOVIE_BUFF = 'movie buff',
}

export default function Header({ movies }: HeaderProps): JSX.Element {
  const [watchedMoviesCount, setWatchedMoviesCount] = useState<number>(
    movies ? movies.filter((movie) => movie.isWatched).length : 0
  );

  useEffect(() => {
    if (movies && Array.isArray(movies)) {
      const watched = movies.filter((movie) => movie.isWatched); // Предполагаем, что у movie есть свойство isWatched
      setWatchedMoviesCount(watched.length);
      console.log(watchedMoviesCount);
    } else {
      setWatchedMoviesCount(0);
    }
  }, [movies]);

  const getProfileRating = (moviesAmount: number): ProfileRating => {
    if (moviesAmount === 0) {
      return ProfileRating.EMPTY;
    } else if (moviesAmount > 0 && moviesAmount <= 10) {
      return ProfileRating.NOVICE;
    } else if (moviesAmount >= 11 && moviesAmount <= 20) {
      return ProfileRating.FAN;
    } else if (moviesAmount >= 21) {
      return ProfileRating.MOVIE_BUFF;
    } // Можно добавить default return на случай непредвиденных значений
    return ProfileRating.EMPTY;
  };

  return (
    <div>
      <header className='header'>
        <Link to='cinemaddict-react' className='header__logo-link'>
          <h1 className='header__logo logo'>Cinemaddict</h1>
        </Link>

        <section className='header__profile profile'>
          <p className='profile__rating'>
            {getProfileRating(watchedMoviesCount)}
          </p>
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
