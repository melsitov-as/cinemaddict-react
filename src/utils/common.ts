import dayjs, { Dayjs } from 'dayjs';
import { MovieType } from '../components/film-card/film-card';

export type CardStatus = {
  isInWatchlistActive: string;
  isWatchedActive: string;
  isInFavoritesActive: string;
};

const CSS_SELECTOR_CARD_CONTROL_ACTIVE: string =
  'film-card__controls-item--active';
const CSS_SELECTOR_DETAILS_CONTROL_ACTIVE: string =
  'film-details__control-button--active';

// Генерирует случайное дробное число
export const getRandomPositiveFloat = (
  a: number,
  b: number,
  digits: number = 1
): string => {
  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};

// Генерирует случайное целое число
export const getRandomPositiveInteger = (a: number, b: number): number => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Длительность фильма
export const getDuration = (data: number | undefined): string => {
  if (data) {
    if (data < 60) {
      return `${data % 60}m`;
    } else if (data === 60) {
      return `${data / 60}h`;
    } else {
      return `${Math.floor(data / 60)}h ${data % 60}m`;
    }
  } else {
    return '0';
  }
};

export const getDurationInHandM = (
  data: number
): { hours: number; minutes: number } => ({
  hours: Math.floor(data / 60),
  minutes: data % 60,
});

const getStringOrEmpty = (flag: boolean | undefined, value: string): string =>
  flag ? value : '';

const getCardSelector = (flag: boolean | undefined) =>
  getStringOrEmpty(flag, CSS_SELECTOR_CARD_CONTROL_ACTIVE);

const getDetailsSelector = (flag: boolean | undefined) =>
  getStringOrEmpty(flag, CSS_SELECTOR_DETAILS_CONTROL_ACTIVE);

export const addStatus = (filmCardData: MovieType) => ({
  isInWatchlistActive: getCardSelector(filmCardData.isInWatchlist),
  isWatchedActive: getCardSelector(filmCardData.isWatched),
  isInFavoritesActive: getCardSelector(filmCardData.isInFavorites),
});

export const addPopupStatus = (
  filmCardData: MovieType | undefined
): CardStatus => ({
  isInWatchlistActive: getDetailsSelector(filmCardData?.isInWatchlist),
  isWatchedActive: getDetailsSelector(filmCardData?.isWatched),
  isInFavoritesActive: getDetailsSelector(filmCardData?.isInFavorites),
});

export const isEscKey = (evt: React.KeyboardEvent) =>
  evt.key === 'Escape' || evt.key === 'esc';

export const isCtrlCommandEnterKey = (evt: React.KeyboardEvent): boolean =>
  (evt.ctrlKey && evt.key === 'Enter') || (evt.metaKey && evt.key === 'Enter');

// export const updateItem = (items, update) => {
//   const index = items.findIndex((item) => item.id === update.id);

//   if (index === -1) {
//     return items;
//   }

//   return [
//     ...items.slice(0, index),
//     update,
//     ...items.slice(index + 1),
//   ];
// };

export const sortByDate = (filmA: MovieType, filmB: MovieType): number =>
  dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));

// export const callbackForEachLimited = (items, count, callback) => {
//   Array.from({ length: Math.min(items.length, count) }, (_, ix) =>
//     callback(items[ix])
//   );
// };

export const sortByRating = (a: MovieType, b: MovieType): number => {
  const ratingA = a.rating ?? 0;
  const ratingB = b.rating ?? 0;

  return ratingB - ratingA;
};

export const sortByComments = (a: MovieType, b: MovieType): number => {
  const commentsCountA = a.rating ?? 0;
  const commentsCountB = b.rating ?? 0;

  return commentsCountB - commentsCountA;
};
