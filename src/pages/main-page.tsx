import React, {
  useState,
  useEffect,
  useCallback,
  JSX,
  SetStateAction,
} from 'react';
import Footer from '../components/footer/footer';
import FilmCard, { MovieType } from '../components/film-card/film-card';
import FilmsListTitle from '../components/films-list-title/films-list-title';
import ShowMoreButton from '../components/show-more-button/show-more-button';
import Sort, { SortType } from '../components/sort/sort';
import { useOutletContext } from 'react-router-dom';

import '../css/main.css';
import '../css/normalize.css';
import Popup from '../components/popup/popup';
import {
  // MOVIES_CARDS_COUNT,
  MOVIES_CARDS_COUNT_PER_STEP,
  MOVIES_TOP_RATED_COUNT,
} from '../utils/const';
import { sortByRating, sortByComments, sortByDate } from '../utils/common';
import { FilterType } from '../components/filters/filters';

interface OutletContextType {
  moviesCards: MovieType[];
  sortType: SortType;
  filterType: FilterType;
  handleSortTypeChange: (type: SetStateAction<SortType>) => void;
  handleUpdateMovie: (updatedMovie: MovieType) => void;
  selectedMovie: MovieType | null;
  setSelectedMovie: React.Dispatch<React.SetStateAction<MovieType | null>>;
}

const renderFilmCards = (
  movies: MovieType[],
  count: number,
  onCardClick: (movie: MovieType) => void,
  handleUpdateMovie: (updatedMovie: MovieType) => void
) => {
  const slicedMovies = movies.slice(0, count);

  return slicedMovies.map((movie) => (
    <FilmCard
      key={movie.id}
      movie={movie}
      onClick={() => onCardClick(movie)}
      onUpdateMovie={handleUpdateMovie}
    />
  ));
};

const renderTops = (
  movies: MovieType[],
  sortCallback: ((a: MovieType, b: MovieType) => number) | undefined,
  onCardClick: {
    (movie: any): void;
    (movie: any): void;
    (arg0: MovieType): void;
  },
  handleUpdateMovie: {
    (updatedMovie: MovieType): void;
    (updatedMovie: MovieType): void;
    (updatedMovie: MovieType): void;
  }
) => {
  const sortedAndSlicedMovies = movies
    .sort(sortCallback)
    .slice(0, MOVIES_TOP_RATED_COUNT);

  return sortedAndSlicedMovies.map((movie) => (
    <FilmCard
      key={movie.id}
      movie={movie}
      onClick={() => onCardClick(movie)}
      onUpdateMovie={handleUpdateMovie}
    />
  ));
};

export default function MainPage(): JSX.Element {
  const {
    moviesCards,
    sortType,
    filterType,
    handleSortTypeChange,
    handleUpdateMovie,
    selectedMovie,
    setSelectedMovie,
  } = useOutletContext<OutletContextType>();

  const [displayedMoviesCount, setDisplayedMoviesCount] = useState(
    MOVIES_CARDS_COUNT_PER_STEP
  );
  const [currentSortType, setCurrentSortType] = useState(sortType);

  useEffect(() => {
    setCurrentSortType(sortType);
  }, [sortType]);

  const getSortedMovies = (moviesToSort: MovieType[]) => {
    let sortedMovies = [...moviesToSort]; // Create a copy of the movies array // Create a copy of the movies array

    switch (sortType) {
      case 'rating':
        sortedMovies.sort(sortByRating);
        break;
      case 'comments':
        sortedMovies.sort(sortByComments);
        break;
      case 'date':
        sortedMovies.sort(sortByDate);
        break;
      default:
        // No sorting for 'default' or any other case
        break;
    }

    return sortedMovies;
  };

  const getFilteredMovies = () => {
    switch (filterType) {
      case 'watchlist':
        return moviesCards.filter((movie) => movie.isInWatchlist);
      case 'history':
        return moviesCards.filter((movie) => movie.isWatched);
      case 'favorites':
        return moviesCards.filter((movie) => movie.isInFavorites);
      default:
        return moviesCards; // 'all' or any other case
    }
  };

  const filteredMovies = getFilteredMovies();
  const sortedAndFilteredMovies = getSortedMovies(filteredMovies);

  const handleShowMoreClick = () => {
    setDisplayedMoviesCount(displayedMoviesCount + MOVIES_CARDS_COUNT_PER_STEP);
  };

  const handleCardClick = (movie: MovieType) => {
    setSelectedMovie(movie); // Устанавливаем выбранный фильм
    document.querySelector('body')?.classList.add('hide-overflow');
  };

  // const handlePopupClose = () => {
  //   setSelectedMovie(null); // Закрываем попап
  //   document.querySelector('body').classList.remove('hide-overflow');
  // };

  const handlePopupClose = useCallback(() => {
    setSelectedMovie(null); // Закрываем попап
    document.querySelector('body')?.classList.remove('hide-overflow');
  }, [setSelectedMovie /*, другие зависимости handlePopupClose */]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handlePopupClose();
      }
    };

    if (selectedMovie) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMovie, handlePopupClose]);
  return (
    <>
      <Sort onSortTypeChange={handleSortTypeChange} />
      <section className='films'>
        <section className='films-list'>
          {sortedAndFilteredMovies ? (
            <FilmsListTitle />
          ) : (
            <FilmsListTitle
              text={'There are no movies in our database...'}
              isVisible={true}
            />
          )}

          <div className='films-list__container'>
            {sortedAndFilteredMovies &&
              renderFilmCards(
                sortedAndFilteredMovies,
                displayedMoviesCount,
                handleCardClick,
                handleUpdateMovie
              )}
          </div>
          {sortedAndFilteredMovies
            ? sortedAndFilteredMovies.length > displayedMoviesCount && (
                <ShowMoreButton onClick={handleShowMoreClick} />
              )
            : null}
        </section>

        {sortedAndFilteredMovies && (
          <section className='films-list films-list--extra'>
            <h2 className='films-list__title'>Top rated</h2>

            <div className='films-list__container'>
              {sortedAndFilteredMovies
                ? renderTops(
                    sortedAndFilteredMovies,
                    sortByRating,
                    handleCardClick,
                    handleUpdateMovie
                  )
                : null}
            </div>
          </section>
        )}

        {sortedAndFilteredMovies && (
          <section className='films-list films-list--extra'>
            <h2 className='films-list__title'>Most commented</h2>

            <div className='films-list__container'>
              {sortedAndFilteredMovies
                ? renderTops(
                    sortedAndFilteredMovies,
                    sortByComments,
                    handleCardClick,
                    handleUpdateMovie
                  )
                : null}
            </div>
          </section>
        )}
      </section>
      <Footer movies={moviesCards} />
      {selectedMovie && (
        <Popup
          movie={selectedMovie}
          onClose={handlePopupClose}
          onUpdateMovie={handleUpdateMovie}
        />
      )}{' '}
    </>
  );
}
