import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsFilters, { StatsFilterType } from './stats-filters';

describe('StatsFilters Component', () => {
  let handleStatsFilterTypeChange: jest.Mock;

  beforeEach(() => {
    handleStatsFilterTypeChange = jest.fn();
  });

  test('отображает все радиокнопки фильтра и их метки', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='All time'
      />
    );

    expect(screen.getByLabelText('All time')).toBeInTheDocument();
    expect(screen.getByLabelText('Today')).toBeInTheDocument();
    expect(screen.getByLabelText('Week')).toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();

    expect(screen.getByRole('radio', { name: 'All time' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Today' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Month' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Year' })).toBeInTheDocument();
  });

  test('помечает радиокнопку "All time" как выбранную, когда statsFilterType равен "All time"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='All time'
      />
    );
    const allTimeRadio = screen.getByLabelText('All time');
    const todayRadio = screen.getByLabelText('Today');

    expect(allTimeRadio).toBeChecked();
    expect(todayRadio).not.toBeChecked();
  });

  test('помечает радиокнопку "Today" как выбранную, когда statsFilterType равен "Today"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='Today'
      />
    );

    const todayRadio = screen.getByLabelText('Today');
    const allTimeRadio = screen.getByLabelText('All time');

    expect(todayRadio).toBeChecked();
    expect(allTimeRadio).not.toBeChecked();
  });

  test('помечает радиокнопку "Week" как выбранную, когда statsFilterType равен "Week"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='Week'
      />
    );

    expect(screen.getByLabelText('Week')).toBeChecked();
    expect(screen.getByLabelText('All time')).not.toBeChecked();
  });

  test('помечает радиокнопку "Month" как выбранную, когда statsFilterType равен "Month"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='Month'
      />
    );

    expect(screen.getByLabelText('Month')).toBeChecked();
    expect(screen.getByLabelText('All time')).not.toBeChecked();
  });

  test('помечает радиокнопку "Year" как выбранную, когда statsFilterType равен "Year"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='Year'
      />
    );

    expect(screen.getByLabelText('Year')).toBeChecked();
    expect(screen.getByLabelText('All time')).not.toBeChecked();
  });

  test('вызывает onStatsFilterTypeChange с "Today" при клике на радио "Today"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='All time'
      />
    );

    const todayRadio = screen.getByLabelText('Today');
    fireEvent.click(todayRadio);

    expect(handleStatsFilterTypeChange).toHaveBeenCalledTimes(1);
    expect(handleStatsFilterTypeChange).toHaveBeenCalledWith('Today');
  });

  test('вызывает onStatsFilterTypeChange с "Month" при клике на радио "Month"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='Week'
      />
    );

    const monthRadio = screen.getByLabelText('Month');
    fireEvent.click(monthRadio);

    expect(handleStatsFilterTypeChange).toHaveBeenCalledTimes(1);
    expect(handleStatsFilterTypeChange).toHaveBeenCalledWith('Month');
  });

  test('вызывает onStatsFilterTypeChange с "All time" при клике на радио "All time"', () => {
    render(
      <StatsFilters
        onStatsFilterTypeChange={handleStatsFilterTypeChange}
        statsFilterType='Today'
      />
    );

    const allTimeRadio = screen.getByLabelText('All time');
    fireEvent.click(allTimeRadio);

    expect(handleStatsFilterTypeChange).toHaveBeenCalledTimes(1);
    expect(handleStatsFilterTypeChange).toHaveBeenCalledWith('All time');
  });
});
