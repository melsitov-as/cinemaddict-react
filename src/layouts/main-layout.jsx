import React, { useState } from 'react';
import Header from '../components/header/header';
import Filters from '../components/filters/filters';
import { Outlet } from 'react-router-dom'; // Импортируем Outlet

export default function MainLayout({ movies: initialMovies }) {
  const [moviesCards, setMoviesCards] = useState(initialMovies);
  const [filterType, setFilterType] = useState('all'); // Default filter type
  const [sortType, setSortType] = useState('default'); // Default sort type
  const [selectedMovie, setSelectedMovie] = useState(null);

  const getFilteredMoviesCount = (filter) => {
    switch (filter) {
      case 'watchlist':
        return moviesCards.filter((movie) => movie.isInWatchlist).length;
      case 'history':
        return moviesCards.filter((movie) => movie.isWatched).length;
      case 'favorites':
        return moviesCards.filter((movie) => movie.isInFavorites).length;
      default:
        return 0;
    }
  };

  const watchlistCount = getFilteredMoviesCount('watchlist');
  const historyCount = getFilteredMoviesCount('history');
  const favoritesCount = getFilteredMoviesCount('favorites');

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
  };

  const handleSortTypeChange = (type) => {
    setSortType(type);
  };

  const handleUpdateMovie = (updatedMovie, onChangeSelectedMovie) => {
    setMoviesCards((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );

    if (selectedMovie && selectedMovie.id === updatedMovie.id) {
      setSelectedMovie(updatedMovie);
    }
  };

  return (
    <div>
      <Header movies={moviesCards} />
      <main className='main'>
        <Filters
          watchlistCount={watchlistCount}
          historyCount={historyCount}
          favoritesCount={favoritesCount}
          onFilterTypeChange={handleFilterTypeChange}
        />

        <Outlet
          context={{
            moviesCards,
            sortType,
            filterType,
            handleSortTypeChange,
            handleUpdateMovie,
            selectedMovie,
            setSelectedMovie,
          }}
        />
      </main>
    </div>
  );
}
