import { createReducer } from '@reduxjs/toolkit';
import {
  toggleIsInWatchlist,
  toggleIsInFavorites,
  setSortType,
  setFilterType,
  setStatsActive,
  setStatsFilterType,
  selectFilmCard,
  deleteComment,
  toggleIsWatched,
  addComment,
} from './action';
import { getFilmCardMockData } from '../mock/film-card-mock';
import { MOVIES_CARDS_COUNT } from '../utils/const';
import { MovieType } from '../components/film-card/film-card';
import { FilterType } from '../components/filters/filters';
import { StatsFilterType } from '../components/stats-filters/stats-filters';
import { SortType } from '../components/sort/sort';

export type InitialStateType = {
  filterType: FilterType;
  isStatsActive: boolean;
  statsFilterType: StatsFilterType;
  sortType: SortType;
  currentFilmCard: undefined | MovieType;
  filmCards: null | MovieType[];
};

const getFilmCards = (count: number) => {
  return count > 0 ? Array.from({ length: count }, getFilmCardMockData) : null;
};

const initialState: InitialStateType = {
  filterType: 'all',
  isStatsActive: false,
  statsFilterType: 'All time',
  sortType: 'default',
  currentFilmCard: undefined,
  filmCards: getFilmCards(MOVIES_CARDS_COUNT),
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setFilterType, (state, action) => {
    const newFilterType = action.payload.filterType;

    state.filterType = newFilterType;
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
          state.filmCards[filmIndex].isInWatchlist =
            !state.filmCards[filmIndex].isInWatchlist;
        }
      }
    }

    if (
      state.currentFilmCard &&
      state.currentFilmCard.id === action.payload.id
    ) {
      state.currentFilmCard.isInWatchlist =
        !state.currentFilmCard.isInWatchlist;
    }
  });
  builder.addCase(toggleIsWatched, (state, action) => {
    if (action.payload && action.payload.id) {
      const targetFilmId = action.payload.id;

      if (state.filmCards) {
        const filmIndex = state.filmCards.findIndex(
          (filmCard) => filmCard.id === targetFilmId
        );

        if (filmIndex !== -1) {
          state.filmCards[filmIndex].isWatched =
            !state.filmCards[filmIndex].isWatched;
        }
      }
    }

    if (
      state.currentFilmCard &&
      state.currentFilmCard.id === action.payload.id
    ) {
      state.currentFilmCard.isWatched = !state.currentFilmCard.isWatched;
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

    if (
      state.currentFilmCard &&
      state.currentFilmCard.id === action.payload.id
    ) {
      state.currentFilmCard.isInFavorites =
        !state.currentFilmCard.isInFavorites;
    }
  });
  builder.addCase(selectFilmCard, (state, action) => {
    const newFilmCard = action.payload.currentFilmCard;

    state.currentFilmCard = newFilmCard;
  });
  builder.addCase(deleteComment, (state, action) => {
    const commentIdToDelete = action.payload?.id;

    if (state.currentFilmCard && state.currentFilmCard.comments) {
      state.currentFilmCard.comments = state.currentFilmCard.comments.filter(
        (comment) => comment.id !== commentIdToDelete
      );
      if (typeof state.currentFilmCard.commentsCount !== 'undefined') {
        state.currentFilmCard.commentsCount -= 1;
      }
    }
    if (state.filmCards) {
      const filmIndex = state.filmCards.findIndex(
        (filmCard) =>
          filmCard.comments &&
          filmCard.comments.some((comment) => comment.id === commentIdToDelete)
      );

      if (filmIndex !== -1) {
        const filmCardToUpdate = state.filmCards[filmIndex];

        if (filmCardToUpdate) {
          if (typeof filmCardToUpdate.commentsCount !== 'undefined') {
            filmCardToUpdate.commentsCount -= 1;
          }
          if (filmCardToUpdate.comments) {
            filmCardToUpdate.comments = filmCardToUpdate.comments.filter(
              (comment) => comment.id !== commentIdToDelete
            );
          }
        }
      }
    }
  });
  builder.addCase(addComment, (state, action) => {
    const commentToAdd = action.payload?.newComment;
    if (state.currentFilmCard) {
      if (!state.currentFilmCard.comments) {
        state.currentFilmCard.comments = [];
      }
      state.currentFilmCard.comments.push(commentToAdd);
      if (typeof state.currentFilmCard.commentsCount === 'number') {
        state.currentFilmCard.commentsCount += 1;
      } else {
        state.currentFilmCard.commentsCount = 1;
      }
    }
    const targetFilmId = state.currentFilmCard?.id;
    if (
      state.filmCards &&
      targetFilmId !== undefined &&
      targetFilmId !== null
    ) {
      const filmIndex = state.filmCards.findIndex(
        (filmCard) => filmCard.id === targetFilmId
      );

      if (filmIndex !== -1) {
        const filmCardInList = state.filmCards[filmIndex];

        if (filmCardInList) {
          if (!filmCardInList.comments) {
            filmCardInList.comments = [];
          }
          filmCardInList.comments.push(commentToAdd);

          if (typeof filmCardInList.commentsCount !== 'undefined') {
            filmCardInList.commentsCount += 1;
          } else {
            filmCardInList.commentsCount = 1;
          }
        }
      }
    }
  });
});

export { reducer };
