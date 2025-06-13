import {
  render,
  screen,
  cleanup,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Popup from './popup';

const mockToggleIsInFavorites = jest.fn();
const mockToggleIsInWatchlist = jest.fn();
const mockToggleIsWatched = jest.fn();
const mockAddComment = jest.fn();

jest.mock('../../store/action', () => ({
  toggleIsInFavorites: (...args: any[]) => {
    mockToggleIsInFavorites(...args);
    return { type: 'MOCK_TOGGLE_FAVORITES' };
  },
  toggleIsInWatchlist: (...args: any[]) => {
    mockToggleIsInWatchlist(...args);
    return { type: 'MOCK_TOGGLE_WATCHLIST' };
  },
  toggleIsWatched: (...args: any[]) => {
    mockToggleIsWatched(...args);
    return { type: 'MOCK_TOGGLE_WATCHED' };
  },
  addComment: (...args: any[]) => {
    mockAddComment(...args);
    return { type: 'MOCK_ADD_COMMENT' };
  },
}));

const mockUseAppSelector = jest.fn();
jest.mock('../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector(),
}));

const mockGetDuration = jest.fn();
const mockAddPopupStatus = jest.fn();

jest.mock('../../utils/common', () => ({
  getDuration: (args: number | undefined) => mockGetDuration(args),
  addPopupStatus: (...args: any[]) => mockAddPopupStatus(...args),
  CardStatus: {
    ACTIVE: 'film-details__control-button--active',
    INACTIVE: '',
  },
}));

const mockHeEncode = jest.fn();
jest.mock('he', () => ({
  encode: (...args: any[]) => mockHeEncode(...args),
}));

jest.mock('../comment/comment', () => ({
  __esModule: true,
  default: ({
    comment,
    onDelete,
  }: {
    comment: any;
    onDelete: (id: string) => void;
  }) => (
    <li data-testid={`comment-item-${comment.id}`} key={comment.id}>
      <p>{comment.text}</p>
      <button onClick={() => onDelete(comment.id)}>
        Delete Comment {comment.id}
      </button>
    </li>
  ),
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
  originalTitle: string;
  totalDuration: number;
  image: string;
  ageRating: string;
  rating: number;
  director: string;
  screenwriters: string[];
  actors: string[];
  releaseDateDMY: string;
  country: string;
  genreTitle: string;
  genre: string[];
  description: string;
  comments: CommentType[];
  commentsCount: number;
  isInWatchlist: boolean;
  isWatched: boolean;
  isInFavorites: boolean;
};

type RootState = {
  currentFilmCard: MovieType | null;
};

const mockMovie: MovieType = {
  id: '1',
  title: 'Test Movie Title',
  originalTitle: 'Original Test Movie Title',
  totalDuration: 120,
  image: 'test-poster.jpg',
  ageRating: '18+',
  rating: 8.5,
  director: 'Test Director',
  screenwriters: ['Writer One', 'Writer Two'],
  actors: ['Actor One', 'Actor Two'],
  releaseDateDMY: '01 January 2023',
  country: 'USA',
  genreTitle: 'Genre',
  genre: ['Action', 'Comedy'],
  description: 'This is a test movie description.',
  comments: [
    {
      id: 'c1',
      author: 'User1',
      text: 'Great movie!',
      date: '01/01/2023',
      emoji: 'smile',
    },
    {
      id: 'c2',
      author: 'User2',
      text: 'Loved it!',
      date: '02/01/2023',
      emoji: 'sleeping',
    },
  ],
  commentsCount: 2,
  isInWatchlist: false,
  isWatched: false,
  isInFavorites: false,
};

const mockStore = configureStore<RootState>([]);
let store: ReturnType<typeof mockStore>;

const renderPopup = (
  initialMovie: MovieType | null = mockMovie,
  onClose = jest.fn(),
  onUpdateMovie = jest.fn()
) => {
  mockUseAppSelector.mockReturnValue(initialMovie);
  store = mockStore({ currentFilmCard: initialMovie });
  mockGetDuration.mockReturnValue('2h 0m');
  mockAddPopupStatus.mockImplementation((movie: MovieType | null) => {
    const LOCAL_MOCKED_CARD_STATUS = {
      ACTIVE: 'film-details__control-button--active',
      INACTIVE: '',
    };

    if (!movie) {
      return {
        isInWatchlistActive: '',
        isWatchedActive: '',
        isInFavoritesActive: '',
      };
    }
    return {
      isInWatchlistActive: movie.isInWatchlist
        ? LOCAL_MOCKED_CARD_STATUS.ACTIVE
        : LOCAL_MOCKED_CARD_STATUS.INACTIVE,
      isWatchedActive: movie.isWatched
        ? LOCAL_MOCKED_CARD_STATUS.ACTIVE
        : LOCAL_MOCKED_CARD_STATUS.INACTIVE,
      isInFavoritesActive: movie.isInFavorites
        ? LOCAL_MOCKED_CARD_STATUS.ACTIVE
        : LOCAL_MOCKED_CARD_STATUS.INACTIVE,
    };
  });
  mockHeEncode.mockImplementation((text: string) => text);

  return render(
    <Provider store={store}>
      <Popup onClose={onClose} onUpdateMovie={onUpdateMovie} />
    </Provider>
  );
};

describe('Popup Component', () => {
  let onCloseMock: jest.Mock;
  let onUpdateMovieMock: jest.Mock;

  beforeEach(() => {
    onCloseMock = jest.fn();
    onUpdateMovieMock = jest.fn();
    cleanup();
    jest.clearAllMocks();
  });

  test('renders film details correctly when movie data is available', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);

    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.originalTitle)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.ageRating)).toBeInTheDocument();
    expect(screen.getByText(String(mockMovie.rating))).toBeInTheDocument();
    expect(screen.getByText(mockMovie.director)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.releaseDateDMY)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.country)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.description)).toBeInTheDocument();

    expect(screen.getByText(/Writer One\s*Writer Two/)).toBeInTheDocument();
    expect(screen.getByText(/Actor One\s*Actor Two/)).toBeInTheDocument();
    expect(screen.getByText(/Action\s*Comedy/)).toBeInTheDocument();

    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      `/cinemaaddict-react/images/posters/${mockMovie.image}`
    );

    expect(mockGetDuration).toHaveBeenCalledTimes(1);
    expect(mockGetDuration).toHaveBeenCalledWith(mockMovie.totalDuration);
    expect(screen.getByText('2h 0m')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Add to watchlist' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Already watched' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add to favorites' })
    ).toBeInTheDocument();

    expect(screen.getByText(`Comments`)).toBeInTheDocument();
    expect(
      screen.getByText(String(mockMovie.commentsCount))
    ).toBeInTheDocument();
    expect(screen.getAllByTestId(/comment-item-/)).toHaveLength(
      mockMovie.comments.length
    );
  });

  test('calls onClose when close button is clicked', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const closeButton = screen.getByRole('button', { name: 'close' });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('dispatches toggleIsInWatchlist when "Add to watchlist" button is clicked', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const watchlistButton = screen.getByRole('button', {
      name: 'Add to watchlist',
    });
    fireEvent.click(watchlistButton);
    expect(mockToggleIsInWatchlist).toHaveBeenCalledTimes(1);
    expect(mockToggleIsInWatchlist).toHaveBeenCalledWith({ id: mockMovie.id });
  });

  test('dispatches toggleIsWatched when "Already watched" button is clicked', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const watchedButton = screen.getByRole('button', {
      name: 'Already watched',
    });
    fireEvent.click(watchedButton);
    expect(mockToggleIsWatched).toHaveBeenCalledTimes(1);
    expect(mockToggleIsWatched).toHaveBeenCalledWith({ id: mockMovie.id });
  });

  test('dispatches toggleIsInFavorites when "Add to favorites" button is clicked', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const favoriteButton = screen.getByRole('button', {
      name: 'Add to favorites',
    });
    fireEvent.click(favoriteButton);
    expect(mockToggleIsInFavorites).toHaveBeenCalledTimes(1);
    expect(mockToggleIsInFavorites).toHaveBeenCalledWith({ id: mockMovie.id });
  });

  test('applies active classes based on movie status', () => {
    const activeMovie = {
      ...mockMovie,
      isInWatchlist: true,
      isWatched: true,
      isInFavorites: true,
    };
    renderPopup(activeMovie, onCloseMock, onUpdateMovieMock);

    expect(
      screen.getByRole('button', { name: 'Add to watchlist' })
    ).toHaveClass('film-details__control-button--active');
    expect(screen.getByRole('button', { name: 'Already watched' })).toHaveClass(
      'film-details__control-button--active'
    );
    expect(
      screen.getByRole('button', { name: 'Add to favorites' })
    ).toHaveClass('film-details__control-button--active');
  });

  test('updates new comment text state on textarea change', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const commentInput = screen.getByPlaceholderText(
      'Select reaction below and write comment here'
    );
    const testComment = 'This is a new test comment.';

    fireEvent.change(commentInput, { target: { value: testComment } });
    expect(commentInput).toHaveValue(testComment);
  });

  test('selects an emoji when an emoji radio button is clicked and displays it', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);

    const smileEmojiRadio = screen.getByLabelText('smile');
    const pukeEmojiRadio = screen.getByLabelText('puke');

    fireEvent.click(smileEmojiRadio);
    expect(smileEmojiRadio).toBeChecked();
    expect(screen.getByAltText('emoji-smile')).toHaveAttribute(
      'src',
      './cinemaaddict-react/images/emoji/smile.png'
    );

    fireEvent.click(pukeEmojiRadio);
    expect(pukeEmojiRadio).toBeChecked();
    expect(screen.getByAltText('emoji-puke')).toHaveAttribute(
      'src',
      './cinemaaddict-react/images/emoji/puke.png'
    );
  });

  test('adds a new comment when text is entered and Enter is pressed (without Shift)', async () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const commentInput = screen.getByPlaceholderText(
      'Select reaction below and write comment here'
    );
    const testComment = 'This is a new test comment.';

    fireEvent.change(commentInput, { target: { value: testComment } });
    expect(commentInput).toHaveValue(testComment);

    await act(async () => {
      fireEvent.keyDown(commentInput, { key: 'Enter', code: 'Enter' });
    });

    expect(mockAddComment).toHaveBeenCalledTimes(1);
    const newCommentPayload = mockAddComment.mock.calls[0][0].newComment;
    expect(newCommentPayload.text).toBe(testComment);
    expect(newCommentPayload.emoji).toBeNull();

    expect(commentInput).toHaveValue('');
    expect(screen.queryByAltText('emoji')).not.toBeInTheDocument();
  });

  test('does not add a new comment if comment text is empty on Enter', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);
    const commentInput = screen.getByPlaceholderText(
      'Select reaction below and write comment here'
    );

    fireEvent.change(commentInput, { target: { value: '' } });
    fireEvent.keyDown(commentInput, { key: 'Enter', code: 'Enter' });

    expect(mockAddComment).not.toHaveBeenCalled();
    expect(commentInput).toHaveValue('');
  });

  test('applies correct styles for selected emoji', () => {
    renderPopup(mockMovie, onCloseMock, onUpdateMovieMock);

    const smileEmojiRadio = screen.getByLabelText(/smile/i);
    fireEvent.click(smileEmojiRadio);
    const displayedEmoji = screen.getByAltText('emoji');
    expect(displayedEmoji).toHaveStyle('position: absolute');
    expect(displayedEmoji).toHaveStyle('top: calc(50% - 25px)');
    expect(displayedEmoji).toHaveStyle('left: calc(50% - 25px)');

    const sleepingEmojiRadio = screen.getByLabelText(/sleeping/i);
    fireEvent.click(sleepingEmojiRadio);
    expect(screen.getByAltText('emoji')).toHaveAttribute(
      'src',
      '/cinemaaddict-react/images/emoji/sleeping.png'
    );
    expect(screen.getByAltText('emoji')).toHaveStyle('width: 50px');
    expect(screen.getByAltText('emoji')).toHaveStyle('height: 50px');
  });
});
