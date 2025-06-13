import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from './header';

type MovieTypeTest = {
  id: string;
  title: string;
  isWatched: boolean;
};

type RootState = {
  filmCards: MovieTypeTest[];
};

const mockUseAppSelector = jest.fn();
jest.mock('../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector(), // Возвращаем результат вызова mockUseAppSelector
}));

const mockStore = configureStore<RootState>([]);

const baseInitialState: RootState = {
  filmCards: [],
};

const renderWithProviders = (
  component: React.ReactElement,
  initialState: RootState = baseInitialState
) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <Router>{component}</Router>
    </Provider>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    mockUseAppSelector.mockClear();
    cleanup();
  });

  afterEach(() => {
    mockUseAppSelector.mockReturnValue(baseInitialState.filmCards);
  });

  test('renders the Cinemaddict logo and a link to home', () => {
    mockUseAppSelector.mockReturnValue(baseInitialState.filmCards); // Устанавливаем начальное состояние
    renderWithProviders(<Header />);

    const logoLink = screen.getByRole('link', { name: 'Cinemaddict' });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/cinemaaddict-react');

    const logoHeading = screen.getByRole('heading', { name: 'Cinemaddict' });
    expect(logoHeading).toBeInTheDocument();
    expect(logoHeading).toHaveClass('header__logo');
  });

  test('renders the profile avatar', () => {
    mockUseAppSelector.mockReturnValue(baseInitialState.filmCards);
    renderWithProviders(<Header />);

    const avatar = screen.getByAltText('Avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('profile__avatar');
    expect(avatar).toHaveAttribute(
      'src',
      '/cinemaaddict-react/images/bitmap@2x.png'
    );
  });

  test('displays "You haven\'t watched any movies yet." when 0 movies are watched', () => {
    mockUseAppSelector.mockReturnValue([]); // Пустой массив фильмов (0 просмотренных)
    renderWithProviders(<Header />);
    expect(
      screen.getByText("You haven't watched any movies yet.")
    ).toBeInTheDocument();
  });

  test('displays "Novice" when 1-10 movies are watched', () => {
    const watchedMovies: MovieTypeTest[] = Array.from(
      { length: 5 },
      (_, i) => ({
        id: `${i}`,
        title: `Movie ${i}`,
        isWatched: true,
      })
    );
    mockUseAppSelector.mockReturnValue(watchedMovies);
    renderWithProviders(<Header />);
    expect(screen.getByText('Novice')).toBeInTheDocument();
  });

  test('displays "Fan" when 11-20 movies are watched', () => {
    const watchedMovies: MovieTypeTest[] = Array.from(
      { length: 15 },
      (_, i) => ({
        id: `${i}`,
        title: `Movie ${i}`,
        isWatched: true,
      })
    );
    mockUseAppSelector.mockReturnValue(watchedMovies);
    renderWithProviders(<Header />);
    expect(screen.getByText('Fan')).toBeInTheDocument();
  });

  test('displays "Movie buff" when 21+ movies are watched', () => {
    const watchedMovies: MovieTypeTest[] = Array.from(
      { length: 25 },
      (_, i) => ({
        id: `${i}`,
        title: `Movie ${i}`,
        isWatched: true,
      })
    );
    mockUseAppSelector.mockReturnValue(watchedMovies);
    renderWithProviders(<Header />);
    expect(screen.getByText('Movie buff')).toBeInTheDocument();
  });

  test('only watched movies count towards the profile rating', () => {
    const mixedMovies: MovieTypeTest[] = [
      { id: '1', title: 'M1', isWatched: true },
      { id: '2', title: 'M2', isWatched: false },
      { id: '3', title: 'M3', isWatched: true },
      { id: '4', title: 'M4', isWatched: false },
    ];
    mockUseAppSelector.mockReturnValue(mixedMovies);
    renderWithProviders(<Header />);
    expect(screen.getByText('Novice')).toBeInTheDocument();
  });

  test('profile rating updates when movies change', async () => {
    mockUseAppSelector.mockReturnValue([]);
    const { rerender } = renderWithProviders(<Header />);
    expect(
      screen.getByText("You haven't watched any movies yet.")
    ).toBeInTheDocument();

    const updatedMovies: MovieTypeTest[] = Array.from(
      { length: 15 },
      (_, i) => ({
        id: `${i}`,
        title: `Movie ${i}`,
        isWatched: true,
      })
    );
    mockUseAppSelector.mockReturnValue(updatedMovies);

    await act(async () => {
      rerender(
        <Provider
          store={mockStore({ ...baseInitialState, filmCards: updatedMovies })}
        >
          <Router>
            <Header />
          </Router>
        </Provider>
      );
    });

    expect(screen.getByText('Fan')).toBeInTheDocument();
  });
});
