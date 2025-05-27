import React, { useState, useEffect, JSX } from 'react';
import { Link, useLocation, Location } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setFilterType } from '../../store/action';

export type FilterType = '' | 'all' | 'watchlist' | 'history' | 'favorites';

export default function Filters(): JSX.Element {
  const handleFilterClick = (type: FilterType) => {
    dispatch(setFilterType({ filterType: type }));
  };
  const moviesCards = useAppSelector((state) => state.filmCards);
  const activeFilterType = useAppSelector((state) => state.filterType);
  const dispatch = useAppDispatch();

  const [statsActive, setStatsActive] = useState<boolean>(false);
  const location: Location = useLocation();

  const getFilteredMoviesCount = (filter: string) => {
    switch (filter) {
      case 'watchlist':
        return moviesCards?.filter((movie) => movie.isInWatchlist).length;
      case 'history':
        return moviesCards?.filter((movie) => movie.isWatched).length;
      case 'favorites':
        return moviesCards?.filter((movie) => movie.isInFavorites).length;
      default:
        return 0;
    }
  };

  const watchlistCount = getFilteredMoviesCount('watchlist');
  const historyCount = getFilteredMoviesCount('history');
  const favoritesCount = getFilteredMoviesCount('favorites');

  useEffect(() => {
    setStatsActive(location.pathname === '/stats');
    if (location.pathname === '/stats') {
      dispatch(setFilterType({ filterType: '' }));
    }
  }, [location.pathname]); // Зависимость от location.pathname

  return (
    <div>
      <nav className='main-navigation'>
        <div className='main-navigation__items'>
          <Link
            to='/cinemaaddict-react'
            className={`main-navigation__item ${
              activeFilterType === 'all' ? 'main-navigation__item--active' : ''
            }`}
            onClick={() => handleFilterClick('all')}
          >
            All movies
          </Link>
          <Link
            to='/cinemaaddict-react'
            className={`main-navigation__item ${
              activeFilterType === 'watchlist'
                ? 'main-navigation__item--active'
                : ''
            }`}
            onClick={() => handleFilterClick('watchlist')}
          >
            Watchlist{' '}
            <span className='main-navigation__item-count'>
              {watchlistCount}
            </span>
          </Link>
          <Link
            to='/cinemaaddict-react'
            className={`main-navigation__item ${
              activeFilterType === 'history'
                ? 'main-navigation__item--active'
                : ''
            }`}
            onClick={() => handleFilterClick('history')}
          >
            History{' '}
            <span className='main-navigation__item-count'>{historyCount}</span>
          </Link>
          <Link
            to='/cinemaaddict-react'
            className={`main-navigation__item ${
              activeFilterType === 'favorites'
                ? 'main-navigation__item--active'
                : ''
            }`}
            onClick={() => handleFilterClick('favorites')}
          >
            Favorites{' '}
            <span className='main-navigation__item-count'>
              {favoritesCount}
            </span>
          </Link>
        </div>
        <Link
          to='/cinemaaddict-react/stats'
          className={`main-navigation__additional ${
            statsActive ? 'main-navigation__additional--active' : ''
          }`}
        >
          {' '}
          Stats
        </Link>
      </nav>
    </div>
  );
}
