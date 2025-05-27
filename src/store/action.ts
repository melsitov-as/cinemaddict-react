import { createAction } from '@reduxjs/toolkit';
import { SortType } from '../components/sort/sort';
import { FilterType } from '../components/filters/filters';
import { StatsFilterType } from '../components/stats-filters/stats-filters';
import { MovieType } from '../components/film-card/film-card';
import { CommentType } from '../components/comment/comment';
import { create } from 'domain';

interface ISetFilterPayload {
  filterType: FilterType;
}

interface ISetStatsActive {
  isStatsActive: boolean;
}

interface ISetSortPayload {
  sortType: SortType;
}

interface IToggleFilmDataPayload {
  id: number | undefined;
}

interface ISetStatsFilterPayload {
  statsFilterType: StatsFilterType;
}

interface ICurrentFilmCardPayload {
  currentFilmCard: undefined | MovieType;
}

interface IDeleteCommentPayload {
  id: string;
}

interface IAddCommentPayload {
  newComment: CommentType;
}

interface ISetProfileRatingPayload {
  status: string;
}

export const setFilterType = createAction<ISetFilterPayload>(
  'filter/setFilterType'
);

export const setStatsActive = createAction<ISetStatsActive>(
  'stats/setStatsActive'
);

export const setSortType = createAction<ISetSortPayload>('sort/setSortType');

export const toggleIsInWatchlist = createAction<IToggleFilmDataPayload>(
  'data/toggleIsInWatchlist'
);

export const toggleIsWatched = createAction<IToggleFilmDataPayload>(
  'data/toggleIsWatchedPayload'
);

export const toggleIsInFavorites = createAction<IToggleFilmDataPayload>(
  'data/toggleFavorites'
);

export const setStatsFilterType = createAction<ISetStatsFilterPayload>(
  'stats/setStatsFilterType'
);

export const selectFilmCard = createAction<ICurrentFilmCardPayload>(
  'data/selectFilmCard'
);

export const deleteComment =
  createAction<IDeleteCommentPayload>('data/deleteComment');

export const addComment = createAction<IAddCommentPayload>('data/addComment');

export const setProfileRating = createAction<ISetProfileRatingPayload>(
  'data/setProfileRating'
);
