import dayjs, { Dayjs } from 'dayjs';
import {
  getRandomPositiveFloat,
  getRandomPositiveInteger,
} from '../utils/common';
import { CommentType } from '../components/comment/comment.js';
import { MovieType } from '../components/film-card/film-card.js';

const LAST_HANDRED_YEARS: number = 36500;
const LAST_ONE_YEAR: number = 30;
const MAX_COMMENT_MINUTES_GAP: number = 5256000;
const MAX_ID: number = 10000;
const MAX_DURATION: number = 240;
const MAX_COMMENTS: number = 15;
const RELEASE_DATE_FORMAT: string = 'DD MMMM YYYY';
const YEAR_FORMAT: string = 'YYYY';
export const COMMENTS_DATE_FORMAT: string = 'YYYY/MM/DD HH:mm';
// const ELLIPSIS = '&#8230;';

const IMAGES_LIST: string[] = [
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'the-dance-of-life.jpg',
  'the-man-with-the-golden-arm.jpg',
  'the-great-flamarion.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'made-for-each-other.png',
];

const TITLES_LIST: string[] = [
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'The Dance of Life',
  'The Man with the Golden Arm',
  'The Great Flamarion',
  'Santa Claus Conquers the Martians',
  'Made for Each Other',
];

export const GENRES_LIST: string[] = [
  ' Drama',
  ' Mystery',
  ' Comedy',
  ' Cartoon',
  ' Western',
  ' Musical',
];

export const SENTENCES_LIST: string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. ',
];

const EMOJIES_LIST: string[] = ['smile', 'sleeping', 'puke', 'angry'];

const formatWithIndex = (value: string, index: number): string =>
  `${value} - ${1 + index}`;

const makeArrayWithIndex = (count: number, value: string): string[] =>
  Array(count)
    .fill(value)
    .map((val, idx) => formatWithIndex(val, idx));

export const AUTHORS_LIST: string[] = makeArrayWithIndex(5, 'Author');
const ORIGINAL_TITLES_LIST: string[] = makeArrayWithIndex(5, 'Original Title');

const DIRECTORS_LIST: string[] = makeArrayWithIndex(5, 'Director');

const SCREENWRITERS_LIST: string[] = makeArrayWithIndex(3, ' Screenwriter');

const ACTORS_LIST: string[] = makeArrayWithIndex(5, ' Actor');

const COUNTRIES_LIST: string[] = makeArrayWithIndex(5, 'Country');

// Генерирует случайный элемент в массиве
export const getRandomItem = (data: string[]): string =>
  data[getRandomPositiveInteger(0, data.length - 1)];

const getRating = (): string => getRandomPositiveFloat(1, 10, 1);

// Класс Генерирует случайный массив

const shuffle = (array: string[]): string[] =>
  array.sort(() => Math.random() - 0.5);

const getRandomArray = (array: string[]): string[] =>
  shuffle(array).slice(0, getRandomPositiveInteger(1, array.length));

const getRandomNegativeYears = (interval: number): number =>
  -getRandomPositiveInteger(1, interval);

const getPastDate = (interval: number): Dayjs =>
  dayjs().add(getRandomNegativeYears(interval), 'day');

const getReleaseDate = (): Dayjs => getPastDate(LAST_HANDRED_YEARS);

const getGenreTitle = (data: string[]): string =>
  data.length === 1 ? 'Genre' : 'Genres';

const getDescription = (data: string[]): string =>
  getRandomArray(data).join(' ');

// const getShortDescription = (data) =>
//   data.length > 140 ? `${data.slice(0, 138)}${ELLIPSIS};` : data;

const getShortDescription = (data: string): string =>
  data.length > 140 ? `${data.slice(0, 138)}${`...`}` : data;

const getAgeRating = (): string => `${getRandomPositiveInteger(0, 18)}+`;

const getDateWatched = (data: boolean): string =>
  data === false ? '' : getPastDate(LAST_ONE_YEAR).toISOString();

const getCommentDate = (): string =>
  dayjs()
    .add(-getRandomPositiveInteger(0, MAX_COMMENT_MINUTES_GAP), 'minutes')
    .format(COMMENTS_DATE_FORMAT);

const getComment = (): CommentType => ({
  id: String(getRandomPositiveInteger(0, MAX_ID)),
  emoji: getRandomItem(EMOJIES_LIST),
  text: getRandomItem(SENTENCES_LIST),
  author: getRandomItem(AUTHORS_LIST),
  date: getCommentDate(),
});

const getCommentsMockData = () => {
  const commentsMockData = [];
  for (let ii = 0; ii < getRandomPositiveInteger(0, MAX_COMMENTS); ii++) {
    commentsMockData.push(getComment());
  }

  return commentsMockData;
};

const getCommentsTitle = (data: number) =>
  data === 1 ? 'comment' : 'comments';

const getRandomFlag = (): boolean => Boolean(getRandomPositiveInteger(0, 1));

// const oldMovies = [
//   { id: 1, name: 'Casablanca' },
//   { id: 2, name: 'Citizen Kane' },
//   { id: 3, name: 'The Godfather' },
//   { id: 4, name: 'Gone with the Wind' },
//   { id: 5, name: 'The Wizard of Oz' },
//   { id: 6, name: "Singin' in the Rain" },
//   { id: 7, name: 'Lawrence of Arabia' },
//   { id: 8, name: 'Psycho' },
//   { id: 9, name: '12 Angry Men' },
//   { id: 10, name: 'Sunset Boulevard' },
//   { id: 11, name: 'Some Like It Hot' },
//   { id: 12, name: 'The Bridge on the River Kwai' },
//   { id: 13, name: 'Dr. Strangelove' },
//   { id: 14, name: 'Rear Window' },
//   { id: 15, name: 'Vertigo' },
// ];

export const getFilmCardMockData = (): MovieType => {
  const releaseDate = getReleaseDate().toISOString();
  const genre = getRandomArray(GENRES_LIST);
  const description = getDescription(SENTENCES_LIST);
  const isWatched = getRandomFlag();
  const commentsData = getCommentsMockData();
  return {
    id: getRandomPositiveInteger(0, MAX_ID),
    number: getRandomPositiveInteger(0, MAX_ID),
    image: getRandomItem(IMAGES_LIST),
    title: getRandomItem(TITLES_LIST),
    originalTitle: getRandomItem(ORIGINAL_TITLES_LIST),
    rating: Number(getRating()),
    director: getRandomItem(DIRECTORS_LIST),
    screenwriters: getRandomArray(SCREENWRITERS_LIST),
    actors: getRandomArray(ACTORS_LIST),
    releaseDate: releaseDate,
    releaseDateDMY: dayjs(releaseDate).format(RELEASE_DATE_FORMAT),
    year: dayjs(releaseDate).format(YEAR_FORMAT),
    totalDuration: getRandomPositiveInteger(80, MAX_DURATION),
    country: getRandomItem(COUNTRIES_LIST),
    genre: genre,
    genreTitle: getGenreTitle(genre),
    description: description,
    shortDescription: getShortDescription(description),
    ageRating: getAgeRating(),
    isInWatchlist: getRandomFlag(),
    isWatched: isWatched,
    isInFavorites: getRandomFlag(),
    dateWatched: getDateWatched(isWatched),
    isRegular: false,
    isTopRated: false,
    isMostCommented: false,
    comments: commentsData,
    commentsCount: commentsData.length,
    commentsTitle: getCommentsTitle(commentsData.length),
  };
};
