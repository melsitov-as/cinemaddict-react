import { ProfileRating } from '../../utils/const';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ movies }) {
  const [watchedMoviesCount, setWatchedMoviesCount] = useState(
    movies ? movies.filter((movie) => movie.isWatched).length : 0
  );

  console.log(watchedMoviesCount);

  useEffect(() => {
    if (movies && Array.isArray(movies)) {
      const watched = movies.filter((movie) => movie.isWatched); // Предполагаем, что у movie есть свойство isWatched
      setWatchedMoviesCount(watched.length);
      console.log(watchedMoviesCount);
    } else {
      setWatchedMoviesCount(0);
    }
  }, [movies]);

  const getProfileRating = (moviesAmount) => {
    if (moviesAmount === 0) {
      return ProfileRating.EMPTY;
    } else if (moviesAmount > 0 && moviesAmount <= 10) {
      return ProfileRating.NOVICE;
    } else if (moviesAmount >= 11 && moviesAmount <= 20) {
      return ProfileRating.FAN;
    } else if (moviesAmount >= 21) {
      return ProfileRating.MOVIE_BUFF;
    } // Можно добавить default return на случай непредвиденных значений
    return '';
  };

  return (
    <div>
      <header className='header'>
        <Link to='/' className='header__logo-link'>
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
