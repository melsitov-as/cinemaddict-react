import React, { JSX, SetStateAction, useState } from 'react';
import Header from '../components/header/header';
import Filters, { FilterType } from '../components/filters/filters';
import { Outlet } from 'react-router-dom'; // Импортируем Outlet
import { MovieType } from '../components/film-card/film-card';
import { SortType } from '../components/sort/sort';

type MainLayoutProps = {
  movies: MovieType[] | null | undefined;
};

export default function MainLayout({
  movies: initialMovies,
}: MainLayoutProps): JSX.Element {
  const [moviesCards, setMoviesCards] = useState<
    MovieType[] | null | undefined
  >(initialMovies);
  const [filterType, setFilterType] =
    useState<SetStateAction<FilterType>>('all'); // Default filter type
  const [sortType, setSortType] = useState<SetStateAction<SortType>>('default'); // Default sort type
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

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

  const handleFilterTypeChange = (type: SetStateAction<FilterType>) => {
    setFilterType(type);
  };

  const handleSortTypeChange = (type: SetStateAction<SortType>) => {
    setSortType(type);
  };

  const handleUpdateMovie = (updatedMovie: MovieType) => {
    setMoviesCards((prevMovies) =>
      prevMovies?.map((movie) =>
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
