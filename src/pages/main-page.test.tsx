import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

import MainPage from './main-page';
import * as reduxHooks from '../hooks';
import * as routerDom from 'react-router-dom';

jest.mock('../components/film-card/film-card', () => ({
  __esModule: true,
  default: ({ movie, onClick }: { movie: any; onClick: () => void }) => (
    <div data-testid={`film-card-${movie.id}`} onClick={onClick}>
      {movie.title}
    </div>
  ),
}));

jest.mock('../components/sort/sort', () => () => (
  <div data-testid='mock-sort'>Mock Sort</div>
));
jest.mock('../components/films-list-title/films-list-title', () => ({
  __esModule: true,
  default: ({
    text = 'Default Title',
    isVisible = true,
  }: {
    text?: string;
    isVisible?: boolean;
  }) =>
    isVisible ? <h2 data-testid='mock-films-list-title'>{text}</h2> : null,
}));
jest.mock('../components/show-more-button/show-more-button', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid='mock-show-more-button' onClick={onClick}>
      Show More
    </button>
  ),
}));
jest.mock('../components/footer/footer', () => ({
  __esModule: true,
  default: () => <footer data-testid='mock-footer'>Mock Footer</footer>,
}));
jest.mock('../components/popup/popup', () => ({
  __esModule: true,
  default: ({
    onClose,
    onUpdateMovie,
  }: {
    onClose: () => void;
    onUpdateMovie: (m: any) => void;
  }) => (
    <div data-testid='mock-popup'>
      Mock Popup
      <button data-testid='popup-close-button' onClick={onClose}>
        Close Popup
      </button>
      <button
        data-testid='popup-update-button'
        onClick={() =>
          onUpdateMovie({ id: 'updated-movie-id', title: 'Updated Title' })
        }
      >
        Update Movie
      </button>
    </div>
  ),
}));

const mockUseAppSelector = jest.fn();
const mockUseAppDispatch = jest.fn();
jest.mock('../hooks', () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
  useAppDispatch: () => mockUseAppDispatch,
}));

const mockUseOutletContext = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => mockUseOutletContext(),
}));

jest.mock('../utils/common', () => ({
  sortByRating: jest.fn((a: any, b: any) => a.rating - b.rating), // Added any types for mocks
  sortByComments: jest.fn(
    (a: any, b: any) => a.commentsCount - b.commentsCount
  ),
  sortByDate: jest.fn(
    (a: any, b: any) =>
      new Date(a.releaseDateDMY).getTime() -
      new Date(b.releaseDateDMY).getTime()
  ),
}));

jest.mock('../utils/const', () => ({
  MOVIES_CARDS_COUNT_PER_STEP: 2,
  MOVIES_TOP_RATED_COUNT: 1,
}));

export type CommentType = {
  id: string;
  author: string;
  text: string;
  date: string;
  emoji: string | null;
};

export type MovieType = {
  id: string;
  title: string;
  originalTitle?: string;
  totalDuration?: number;
  image?: string;
  ageRating?: string;
  rating: number;
  director?: string;
  screenwriters?: string[];
  actors?: string[];
  releaseDateDMY: string;
  country?: string;
  genreTitle?: string;
  genre?: string[];
  description?: string;
  comments: CommentType[];
  commentsCount: number;
  isInWatchlist: boolean;
  isWatched: boolean;
  isInFavorites: boolean;
};

type RootState = {
  filmCards: MovieType[];
  sortType: string;
  currentFilmCard: MovieType | null;
};

const mockMovies: MovieType[] = [
  {
    id: '1',
    title: 'Movie A',
    rating: 9,
    commentsCount: 5,
    releaseDateDMY: '01 January 2023',
    isInWatchlist: true,
    isWatched: false,
    isInFavorites: false,
    comments: [],
  },
  {
    id: '2',
    title: 'Movie B',
    rating: 7,
    commentsCount: 8,
    releaseDateDMY: '01 February 2023',
    isInWatchlist: false,
    isWatched: true,
    isInFavorites: false,
    comments: [],
  },
  {
    id: '3',
    title: 'Movie C',
    rating: 8,
    commentsCount: 3,
    releaseDateDMY: '01 March 2023',
    isInWatchlist: false,
    isWatched: false,
    isInFavorites: true,
    comments: [],
  },
  {
    id: '4',
    title: 'Movie D',
    rating: 6,
    commentsCount: 10,
    releaseDateDMY: '01 April 2023',
    isInWatchlist: false,
    isWatched: false,
    isInFavorites: false,
    comments: [],
  },
  {
    id: '5',
    title: 'Movie E',
    rating: 10,
    commentsCount: 2,
    releaseDateDMY: '01 May 2023',
    isInWatchlist: false,
    isWatched: false,
    isInFavorites: false,
    comments: [],
  },
];

const mockStoreCreator = configureStore<RootState>([]); // Using a creator

describe('MainPage Component', () => {
  let store: ReturnType<typeof mockStoreCreator>; // Correctly typed
  let dispatchMock: jest.Mock;
  let updateMovieMock: jest.Mock;
  let bodyClassListAddMock: jest.Mock;
  let bodyClassListRemoveMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    dispatchMock = jest.fn();
    mockUseAppDispatch.mockReturnValue(dispatchMock);

    updateMovieMock = jest.fn();
    mockUseOutletContext.mockReturnValue({
      activeFilterType: 'all',
      handleUpdateMovie: updateMovieMock,
    });

    store = mockStoreCreator({
      filmCards: mockMovies,
      sortType: 'default',
      currentFilmCard: null,
    });

    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    bodyClassListAddMock = jest.fn();
    bodyClassListRemoveMock = jest.fn();
    Object.defineProperty(document, 'body', {
      value: {
        classList: {
          add: bodyClassListAddMock,
          remove: bodyClassListRemoveMock,
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  test('renders correctly with default state and films', () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    expect(screen.getByTestId('mock-sort')).toBeInTheDocument();
    expect(screen.getByTestId('mock-films-list-title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-films-list-title')).toHaveTextContent(
      'All movies. Upcoming'
    );

    expect(screen.getAllByTestId(/film-card-/)).toHaveLength(2);

    expect(screen.getByTestId('mock-show-more-button')).toBeInTheDocument();

    expect(screen.getByText('Top rated')).toBeInTheDocument();
    expect(screen.getByText('Most commented')).toBeInTheDocument();

    expect(screen.getAllByText(/Movie A/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Movie E/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Movie D/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
  });

  test('displays "No movies" message when no films are available', () => {
    store = mockStoreCreator({
      filmCards: [],
      sortType: 'default',
      currentFilmCard: null,
    });
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    expect(screen.getByTestId('mock-films-list-title')).toHaveTextContent(
      'There are no movies in our database...'
    );
    expect(
      screen.queryByTestId('mock-show-more-button')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Top rated')).not.toBeInTheDocument();
    expect(screen.queryByText('Most commented')).not.toBeInTheDocument();
  });

  test('clicking "Show More" increases displayed movies count', () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    const showMoreButton = screen.getByTestId('mock-show-more-button');

    expect(screen.getAllByTestId(/film-card-/)).toHaveLength(2); // Изначально 2

    fireEvent.click(showMoreButton);

    expect(screen.getAllByTestId(/film-card-/)).toHaveLength(4); // 2 + 2

    fireEvent.click(showMoreButton);

    expect(screen.getAllByTestId(/film-card-/)).toHaveLength(mockMovies.length); // Все 5 фильмов
    expect(
      screen.queryByTestId('mock-show-more-button')
    ).not.toBeInTheDocument(); // Кнопка исчезает
  });

  test('clicking a film card opens the popup and dispatches selectFilmCard', async () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    const firstFilmCard = screen.getByTestId('film-card-1');

    fireEvent.click(firstFilmCard);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'selectFilmCard', // Проверьте, что имя действия соответствует вашему action
          payload: {
            currentFilmCard: expect.objectContaining({
              id: '1',
              title: 'Movie A',
            }),
          },
        })
      );
      expect(bodyClassListAddMock).toHaveBeenCalledWith('hide-overflow');
      expect(screen.getByTestId('mock-popup')).toBeInTheDocument();
    });
  });

  test('closing the popup dispatches selectFilmCard and removes hide-overflow class', async () => {
    store = mockStoreCreator({
      filmCards: mockMovies,
      sortType: 'default',
      currentFilmCard: mockMovies[0],
    });
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    expect(screen.getByTestId('mock-popup')).toBeInTheDocument(); // Ensure it's open

    const closeButton = screen.getByTestId('popup-close-button');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'selectFilmCard',
          payload: { currentFilmCard: undefined },
        })
      );
      expect(bodyClassListRemoveMock).toHaveBeenCalledWith('hide-overflow');
      expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });
  });

  test('pressing Escape closes the popup', async () => {
    // Override store state for this specific test
    store = mockStoreCreator({
      // Re-assign store for this test
      filmCards: mockMovies,
      sortType: 'default',
      currentFilmCard: mockMovies[0], // Popup is open
    });
    // Ensure selector uses the updated store
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    expect(screen.getByTestId('mock-popup')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'selectFilmCard',
          payload: { currentFilmCard: undefined },
        })
      );
      expect(bodyClassListRemoveMock).toHaveBeenCalledWith('hide-overflow');
      expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });
  });

  test('filters movies correctly based on activeFilterType', () => {
    mockUseOutletContext.mockReturnValue({
      activeFilterType: 'watchlist',
      handleUpdateMovie: updateMovieMock,
    });
    store = mockStoreCreator({
      filmCards: mockMovies,
      sortType: 'default',
      currentFilmCard: null,
    });
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    expect(screen.getByTestId('film-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('film-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('film-card-3')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/film-card-/)).toHaveLength(1);
  });

  test('sorts movies correctly based on sortType (rating)', () => {
    store = mockStoreCreator({
      filmCards: mockMovies,
      sortType: 'rating',
      currentFilmCard: null,
    });
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    expect(require('../utils/common').sortByRating).toHaveBeenCalled();

    const filmCards = screen.getAllByTestId(/film-card-/);
    expect(filmCards[0]).toHaveTextContent('Movie E');
    expect(filmCards[1]).toHaveTextContent('Movie A');
  });

  test('handleUpdateMovie is called when Popup requests update', async () => {
    store = mockStoreCreator({
      filmCards: mockMovies,
      sortType: 'default',
      currentFilmCard: mockMovies[0],
    });
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => any) => {
        return selector(store.getState());
      }
    );

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    expect(screen.getByTestId('mock-popup')).toBeInTheDocument();

    const updateButton = screen.getByTestId('popup-update-button');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateMovieMock).toHaveBeenCalledTimes(1);
      expect(updateMovieMock).toHaveBeenCalledWith({
        id: 'updated-movie-id',
        title: 'Updated Title',
      });
    });
  });
});
