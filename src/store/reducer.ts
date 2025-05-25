import { createReducer } from '@reduxjs/toolkit';
import {
  toggleIsInWatchlist,
  toggleIsInHistory,
  toggleIsInFavorites,
  setSortType,
  setFilterType,
  setStatsActive,
  setStatsFilterType,
} from './action';
import { getFilmCardMockData } from '../mock/film-card-mock';
import { MOVIES_CARDS_COUNT } from '../utils/const';

const getFilmCards = (count: number) => {
  return count > 0 ? Array.from({ length: count }, getFilmCardMockData) : null;
};

const initialState = {
  filterType: 'all',
  isStatsActive: false,
  statsFilterType: 'All time',
  sortType: 'default',
  filmCards: getFilmCards(MOVIES_CARDS_COUNT),
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setFilterType, (state, action) => {
    const newFilterType = action.payload.filterType;

    state.sortType = newFilterType;
  });
  builder.addCase(setStatsActive, (state, action) => {
    const newStatsStatus = action.payload.isStatsActive;

    state.isStatsActive = newStatsStatus;
  });
  builder.addCase(setStatsFilterType, (state, action) => {
    const newStatsFilter = action.payload.statsFilterType;

    state.statsFilterType = newStatsFilter;
  });
  builder.addCase(setSortType, (state, action) => {
    const newSortType = action.payload.sortType;

    state.sortType = newSortType;
  });
  builder.addCase(toggleIsInWatchlist, (state, action) => {
    if (action.payload && action.payload.id) {
      const targetFilmId = action.payload.id;

      if (state.filmCards) {
        const filmIndex = state.filmCards.findIndex(
          (filmCard) => filmCard.id === targetFilmId
        );

        if (filmIndex !== -1) {
          state.filmCards[filmIndex].isInFavorites =
            !state.filmCards[filmIndex].isInFavorites;
        }
      }
    }
  });
  builder.addCase(toggleIsInHistory, (state, action) => {
    if (action.payload && action.payload.id) {
      const targetFilmId = action.payload.id;

      if (state.filmCards) {
        const filmIndex = state.filmCards.findIndex(
          (filmCard) => filmCard.id === targetFilmId
        );

        if (filmIndex !== -1) {
          state.filmCards[filmIndex].isInFavorites =
            !state.filmCards[filmIndex].isInFavorites;
        }
      }
    }
  });
  builder.addCase(toggleIsInFavorites, (state, action) => {
    if (action.payload && action.payload.id) {
      const targetFilmId = action.payload.id;

      if (state.filmCards) {
        const filmIndex = state.filmCards.findIndex(
          (filmCard) => filmCard.id === targetFilmId
        );

        if (filmIndex !== -1) {
          state.filmCards[filmIndex].isInFavorites =
            !state.filmCards[filmIndex].isInFavorites;
        }
      }
    }
  });
});

export { reducer };
