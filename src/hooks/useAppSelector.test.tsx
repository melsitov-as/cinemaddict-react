import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { configureStore, createReducer, createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '.';

const TestComponent: React.FC = () => {
  const moviesCards = useAppSelector((state) => state.filmCards);

  return (
    <div>
      {moviesCards?.map((movie) => (
        <div key={movie.id} data-testid='movie-card'>
          {movie.title}
        </div>
      ))}
    </div>
  );
};

export interface TestMovieType {
  id: number;
  title: string;
  rating: number;
}

const filmCardsSlice = createSlice({
  name: 'filmCards',
  initialState: [
    { id: 1, title: 'Фильм 1', rating: 8.5 },
    { id: 2, title: 'Фильм 2', rating: 7.0 },
  ] as TestMovieType[],
  reducers: {},
});

describe('TestComponent with Redux selector', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        filmCards: filmCardsSlice.reducer,
      },
    });
  });

  it('should correctly select moviesCards from state', () => {
    render(
      <reactRedux.Provider store={store}>
        <TestComponent />
      </reactRedux.Provider>
    );

    expect(screen.getByText('Фильм 1')).toBeInTheDocument();
    expect(screen.getByText('Фильм 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
  });

  it('should return an empty array if filmCards is empty', () => {
    const emptyState = {
      filmCards: [],
    };
    const emptyStore = configureStore({
      reducer: {
        filmCards: (state = emptyState.filmCards, action) => state,
      },
      preloadedState: emptyState,
    });

    render(
      <reactRedux.Provider store={emptyStore}>
        <TestComponent />
      </reactRedux.Provider>
    );

    expect(screen.queryAllByTestId('movie-card')).toHaveLength(0);
  });
});
