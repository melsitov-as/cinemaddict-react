import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainLayout from './main-layout';
import { useOutletContext } from 'react-router-dom';
import * as reduxHooks from '../hooks';

// --- Мокирование зависимостей ---

jest.mock('../components/header/header', () => () => (
  <div data-testid='mock-header'>Mock Header</div>
));
jest.mock('../components/filters/filters', () => () => (
  <div data-testid='mock-filters'>Mock Filters</div>
));

const mockUseAppSelector = jest.fn();
jest.mock('../hooks', () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

jest.mock('react-router-dom', () => {
  const MockOutletChild = () => {
    const context = useOutletContext();
    const serializableContext = {
      moviesCards: (context as any)?.moviesCards ?? null,
      // Изменено на null, если MainLayout действительно передает default
      sortType: (context as any)?.sortType ?? null,
      activeFilterType: (context as any)?.activeFilterType ?? null, // Тоже можно изменить
      selectedMovie: (context as any)?.selectedMovie ?? null,
    };
    return (
      <div data-testid='outlet-child'>
        <div data-testid='context-data'>
          {JSON.stringify(serializableContext)}
        </div>
        {/* Кнопки для взаимодействия с функциями */}
        <button
          data-testid='sort-type-change-button'
          onClick={() => (context as any)?.handleSortTypeChange('date')}
        >
          Change Sort
        </button>
        <button
          data-testid='set-movie-button'
          onClick={() =>
            (context as any)?.setSelectedMovie({
              id: 'mock-id',
              title: 'Mock Title',
            } as any)
          }
        >
          Set Movie
        </button>
      </div>
    );
  };
  return {
    ...jest.requireActual('react-router-dom'),
    Outlet: MockOutletChild,
  };
});

describe('MainLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockImplementation((selector: any) => {
      const mockReduxState = {
        filmCards: [],
        filterType: 'all',
      };
      return selector(mockReduxState);
    });
  });

  test('рендерит компоненты Header и Filters', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-filters')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('setSelectedMovie корректно обновляет состояние selectedMovie (initial check)', () => {
    mockUseAppSelector.mockReturnValue([]);
    render(<MainLayout />);

    const outletChildData = screen.getByTestId('context-data');
    const contextProps = JSON.parse(outletChildData.textContent || '{}');

    expect(contextProps).toHaveProperty('selectedMovie', null);
  });
});
