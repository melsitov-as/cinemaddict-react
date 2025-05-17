import React, { useState, useEffect, JSX } from 'react';
import { Link, useLocation, Location } from 'react-router-dom';

type FiltersProps = {
  watchlistCount: number | undefined;
  historyCount: number | undefined;
  favoritesCount: number | undefined;
  onFilterTypeChange: (type: React.SetStateAction<FilterType>) => void;
};

export type FilterType = '' | 'all' | 'watchlist' | 'history' | 'favorites';

export default function Filters({
  watchlistCount,
  historyCount,
  favoritesCount,
  onFilterTypeChange,
}: FiltersProps): JSX.Element {
  const [activeFilterType, setActiveFilterType] = useState<FilterType>('all');
  const handleFilterClick = (type: React.SetStateAction<FilterType>) => {
    setActiveFilterType(type);
    onFilterTypeChange(type);
  };
  const [statsActive, setStatsActive] = useState<boolean>(false);
  const location: Location = useLocation();

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
          Stats
        </Link>
      </nav>
    </div>
  );
}
