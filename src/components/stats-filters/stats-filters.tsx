import React, { ChangeEventHandler, JSX } from 'react';

export type StatsFilterType = 'All time' | 'Today' | 'Week' | 'Month' | 'Year';

type StatsFiltersProps = {
  onStatsFilterTypeChange: (type: StatsFilterType) => void;
  statsFilterType: string;
};

export default function StatsFilters({
  onStatsFilterTypeChange,
  statsFilterType,
}: StatsFiltersProps): JSX.Element {
  const handleStatsFilterClick = (type: StatsFilterType) => {
    onStatsFilterTypeChange(type);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    switch (value) {
      case 'all-time':
        handleStatsFilterClick('All time');
        break;
      case 'today':
        handleStatsFilterClick('Today');
        break;
      case 'week':
        handleStatsFilterClick('Week');
        break;
      case 'month':
        handleStatsFilterClick('Month');
        break;
      case 'year':
        handleStatsFilterClick('Year');
        break;
      default:
        // Обработка неожиданного значения (можно выбросить ошибку или сделать что-то по умолчанию)
        console.warn(`Unexpected filter value: ${value}`);
        break;
    }
  };

  return (
    <form
      action='https://echo.htmlacademy.ru/'
      method='get'
      className='statistic__filters'
    >
      <p className='statistic__filters-description'>Show stats:</p>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-all-time'
        value='all-time'
        checked={statsFilterType === 'all-time'}
        onChange={handleInputChange}
      />
      <label htmlFor='statistic-all-time' className='statistic__filters-label'>
        All time
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-today'
        value='today'
        checked={statsFilterType === 'today'}
        onChange={handleInputChange}
      />
      <label htmlFor='statistic-today' className='statistic__filters-label'>
        Today
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-week'
        value='week'
        onChange={handleInputChange}
      />
      <label htmlFor='statistic-week' className='statistic__filters-label'>
        Week
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-month'
        value='month'
        onChange={handleInputChange}
      />
      <label htmlFor='statistic-month' className='statistic__filters-label'>
        Month
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-year'
        value='year'
        onChange={handleInputChange}
      />
      <label htmlFor='statistic-year' className='statistic__filters-label'>
        Year
      </label>
    </form>
  );
}
