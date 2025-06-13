import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sort from './sort';

const mockDispatch = jest.fn();
const mockUseAppSelector = jest.fn();

jest.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

const mockSetSortType = jest.fn();
jest.mock('../../store/action', () => ({
  setSortType: (...args: any[]) => {
    mockSetSortType(...args);
    return { type: 'MOCK_SET_SORT_TYPE' };
  },
}));

describe('Sort Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all sort options', () => {
    mockUseAppSelector.mockReturnValue('default');
    render(<Sort />);

    expect(screen.getByText('Sort by default')).toBeInTheDocument();
    expect(screen.getByText('Sort by date')).toBeInTheDocument();
    expect(screen.getByText('Sort by rating')).toBeInTheDocument();
    expect(screen.getByText('Sort by comments')).toBeInTheDocument();
  });

  test('applies active class to the default sort type when it is active', () => {
    mockUseAppSelector.mockReturnValue('default');
    render(<Sort />);

    expect(screen.getByText('Sort by default')).toHaveClass(
      'sort__button--active'
    );
    expect(screen.getByText('Sort by date')).not.toHaveClass(
      'sort__button--active'
    );
    expect(screen.getByText('Sort by rating')).not.toHaveClass(
      'sort__button--active'
    );
    expect(screen.getByText('Sort by comments')).not.toHaveClass(
      'sort__button--active'
    );
  });

  test('applies active class to the date sort type when it is active', () => {
    mockUseAppSelector.mockReturnValue('date');
    render(<Sort />);

    expect(screen.getByText('Sort by date')).toHaveClass(
      'sort__button--active'
    );
    expect(screen.getByText('Sort by default')).not.toHaveClass(
      'sort__button--active'
    );
  });

  test('applies active class to the rating sort type when it is active', () => {
    mockUseAppSelector.mockReturnValue('rating');
    render(<Sort />);

    expect(screen.getByText('Sort by rating')).toHaveClass(
      'sort__button--active'
    );
    expect(screen.getByText('Sort by default')).not.toHaveClass(
      'sort__button--active'
    );
  });

  test('applies active class to the comments sort type when it is active', () => {
    mockUseAppSelector.mockReturnValue('comments');
    render(<Sort />);

    expect(screen.getByText('Sort by comments')).toHaveClass(
      'sort__button--active'
    );
    expect(screen.getByText('Sort by default')).not.toHaveClass(
      'sort__button--active'
    );
  });

  test('dispatches setSortType with "date" when "Sort by date" is clicked', () => {
    mockUseAppSelector.mockReturnValue('default');
    render(<Sort />);

    const dateButton = screen.getByText('Sort by date');
    fireEvent.click(dateButton);

    expect(mockSetSortType).toHaveBeenCalledTimes(1);
    expect(mockSetSortType).toHaveBeenCalledWith({ sortType: 'date' });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'MOCK_SET_SORT_TYPE' });
  });

  test('dispatches setSortType with "rating" when "Sort by rating" is clicked', () => {
    mockUseAppSelector.mockReturnValue('date');
    render(<Sort />);

    const ratingButton = screen.getByText('Sort by rating');
    fireEvent.click(ratingButton);

    expect(mockSetSortType).toHaveBeenCalledTimes(1);
    expect(mockSetSortType).toHaveBeenCalledWith({ sortType: 'rating' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('dispatches setSortType with "comments" when "Sort by comments" is clicked', () => {
    mockUseAppSelector.mockReturnValue('rating');
    render(<Sort />);

    const commentsButton = screen.getByText('Sort by comments');
    fireEvent.click(commentsButton);

    expect(mockSetSortType).toHaveBeenCalledTimes(1);
    expect(mockSetSortType).toHaveBeenCalledWith({ sortType: 'comments' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('dispatches setSortType with "default" when "Sort by default" is clicked', () => {
    mockUseAppSelector.mockReturnValue('date');
    render(<Sort />);

    const defaultButton = screen.getByText('Sort by default');
    fireEvent.click(defaultButton);

    expect(mockSetSortType).toHaveBeenCalledTimes(1);
    expect(mockSetSortType).toHaveBeenCalledWith({ sortType: 'default' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
