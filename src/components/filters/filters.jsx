import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Filters({
  watchlistCount,
  historyCount,
  favoritesCount,
  onFilterTypeChange,
}) {
  const [activeFilterType, setActiveFilterType] = useState('all');
  const handleFilterClick = (type) => {
    setActiveFilterType(type);
    onFilterTypeChange(type);
  };
  const [statsActive, setStatsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setStatsActive(location.pathname === '/stats');
    if (location.pathname === '/stats') {
      setActiveFilterType('');
    }
  }, [location.pathname]); // Зависимость от location.pathname

  return (
    <div>
      <nav className='main-navigation'>
        <div className='main-navigation__items'>
          <Link
            to='/'
            className={`main-navigation__item ${
              activeFilterType === 'all' ? 'main-navigation__item--active' : ''
            }`}
            onClick={() => handleFilterClick('all')}
          >
            All movies
          </Link>
          <Link
            to='/'
            href='#watchlist'
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
            to='/'
            href='#history'
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
            to='/'
            href='#favorites'
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
          to='/stats'
          className={`main-navigation__additional ${
            statsActive ? 'main-navigation__additional--active' : ''
          }`}
        >
          {' '}
          {/* Используем Link */}
          Stats
        </Link>
      </nav>
    </div>
  );
}
