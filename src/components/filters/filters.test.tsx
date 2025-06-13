import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Filters, { FilterType } from './filters';
type RootStateTest = {
  filmCards: {
    id: string;
    isInWatchlist: boolean;
    isWatched: boolean;
    isInFavorites: boolean;
  }[];
  filterType: string;
};

const mockDispatch = jest.fn();
jest.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock('../../store/action', () => ({
  setFilterType: jest.fn((payload: { filterType: FilterType }) => ({
    type: 'SET_FILTER_TYPE',
    payload,
  })),
}));

import { setFilterType } from '../../store/action';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

import { useLocation } from 'react-router-dom';
import { RootState } from '../../store';

const mockUseAppSelector = require('../../hooks').useAppSelector;

const configureMockStore = configureStore<RootStateTest>([]);

const baseInitialState = {
  filmCards: [
    { id: '1', isInWatchlist: true, isWatched: false, isInFavorites: false },
    { id: '2', isInWatchlist: true, isWatched: true, isInFavorites: true },
    { id: '3', isInWatchlist: false, isWatched: true, isInFavorites: true },
    { id: '4', isInWatchlist: false, isWatched: false, isInFavorites: true },
    { id: '5', isInWatchlist: false, isWatched: false, isInFavorites: false },
  ],
  filterType: 'all',
};

const renderWithProviders = (
  component: React.ReactElement,
  storeState: RootStateTest = baseInitialState,
  path = '/'
) => {
  const store = configureMockStore(storeState);
  (useLocation as jest.Mock).mockReturnValue({ pathname: path });

  return render(
    <Provider store={store}>
      <Router>{component}</Router>
    </Provider>
  );
};

describe('Filters Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    (setFilterType as unknown as jest.Mock).mockClear();
    (useLocation as jest.Mock).mockClear();
    mockUseAppSelector.mockImplementation(
      (selector: (state: typeof baseInitialState) => any) =>
        selector(baseInitialState)
    );
  });

  test('renders all filter links and their counts', () => {
    renderWithProviders(<Filters />);

    expect(screen.getByText('All movies')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();

    const watchlistLink = screen.getByRole('link', { name: /watchlist/i });
    expect(watchlistLink).toBeInTheDocument();
    expect(watchlistLink).toHaveTextContent('Watchlist 2');

    const historyLink = screen.getByRole('link', { name: /history/i });
    expect(historyLink).toBeInTheDocument();
    expect(historyLink).toHaveTextContent('History 2');

    const favoritesLink = screen.getByRole('link', { name: /favorites/i });
    expect(favoritesLink).toBeInTheDocument();
    expect(favoritesLink).toHaveTextContent('Favorites 3');
  });

  test('applies active class to "All movies" when filterType is "all"', () => {
    mockUseAppSelector.mockImplementation(
      (selector: (state: typeof baseInitialState) => any) => {
        const stateWithActiveFilter = {
          ...baseInitialState,
          filterType: 'all',
        };
        return selector(stateWithActiveFilter);
      }
    );

    renderWithProviders(<Filters />);
    const allMoviesLink = screen.getByText('All movies');
    expect(allMoviesLink).toHaveClass('main-navigation__item--active');
  });

  test('applies active class to "Watchlist" when filterType is "watchlist"', () => {
    mockUseAppSelector.mockImplementation(
      (selector: (state: typeof baseInitialState) => any) => {
        const stateWithActiveFilter = {
          ...baseInitialState,
          filterType: 'watchlist',
        };
        return selector(stateWithActiveFilter);
      }
    );

    renderWithProviders(<Filters />);
    const watchlistLink = screen.getByRole('link', { name: /watchlist/i });
    expect(watchlistLink).toHaveClass('main-navigation__item--active');
  });

  test('dispatches setFilterType with "watchlist" when Watchlist filter is clicked', async () => {
    renderWithProviders(<Filters />);
    const watchlistLink = screen.getByRole('link', { name: /watchlist/i });
    fireEvent.click(watchlistLink);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(setFilterType).toHaveBeenCalledWith({ filterType: 'watchlist' });
  });

  test('dispatches setFilterType with "history" when History filter is clicked', () => {
    renderWithProviders(<Filters />);
    const historyLink = screen.getByText('History');
    fireEvent.click(historyLink);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(setFilterType).toHaveBeenCalledWith({ filterType: 'history' });
  });

  test('dispatches setFilterType with "favorites" when Favorites filter is clicked', () => {
    renderWithProviders(<Filters />);
    const favoritesLink = screen.getByText('Favorites');
    fireEvent.click(favoritesLink);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(setFilterType).toHaveBeenCalledWith({ filterType: 'favorites' });
  });

  test('applies active class to "Stats" when location is /stats', async () => {
    renderWithProviders(<Filters />, baseInitialState, '/stats');
    const statsLink = screen.getByText('Stats');
    await waitFor(() => {
      expect(statsLink).toHaveClass('main-navigation__additional');
      expect(statsLink).toHaveClass('main-navigation__additional--active');
    });
  });

  test('dispatches setFilterType with empty string when location changes to /stats', async () => {
    const initialStateForThisTest: RootStateTest = {
      ...baseInitialState,
      filterType: 'history',
    };
    const store = configureMockStore(initialStateForThisTest);

    mockUseAppSelector.mockImplementation(
      (selector: (state: RootStateTest) => any) => {
        return selector(store.getState());
      }
    );

    let currentLocation = { pathname: '/cinemaaddict-react' };
    (useLocation as jest.Mock).mockImplementation(() => currentLocation);

    const { rerender } = render(
      <Provider store={store}>
        <Router>
          <Filters />
        </Router>
      </Provider>
    );

    mockDispatch.mockClear();

    const statsLink = screen.getByText('Stats');
    fireEvent.click(statsLink);
    currentLocation = { pathname: '/cinemaaddict-react/stats' };

    await act(async () => {
      rerender(
        <Provider store={store}>
          <Router>
            <Filters />
          </Router>
        </Provider>
      );
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(setFilterType).toHaveBeenCalledWith({ filterType: '' });
    });
  });

  test('does not dispatch setFilterType with empty string when location is not /stats', () => {
    mockUseAppSelector.mockImplementation(
      (selector: (state: typeof baseInitialState) => any) => {
        if (
          selector === ((state: typeof baseInitialState) => state.filterType)
        ) {
          return 'history';
        }
        return selector(baseInitialState);
      }
    );
    renderWithProviders(<Filters />, baseInitialState, '/cinemaaddict-react');
    expect(mockDispatch).not.toHaveBeenCalledWith(
      setFilterType({ filterType: '' })
    );
  });
});
