import React, { JSX, SetStateAction, useState } from 'react';
import Header from '../components/header/header';
import Filters, { FilterType } from '../components/filters/filters';
import { Outlet } from 'react-router-dom'; // Импортируем Outlet
import { MovieType } from '../components/film-card/film-card';
import { SortType } from '../components/sort/sort';
import { useAppSelector } from '../hooks';

export default function MainLayout({}): JSX.Element {
  const [sortType, setSortType] = useState<SetStateAction<SortType>>('default'); // Default sort type
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  const moviesCards = useAppSelector((state) => state.filmCards);

  const handleSortTypeChange = (type: SetStateAction<SortType>) => {
    setSortType(type);
  };

  const activeFilterType = useAppSelector((state) => state.filterType);

  return (
    <div>
      <Header movies={moviesCards} />
      <main className='main'>
        <Filters />

        <Outlet
          context={{
            moviesCards,
            sortType,
            activeFilterType,
            handleSortTypeChange,
            selectedMovie,
            setSelectedMovie,
          }}
        />
      </main>
    </div>
  );
}
