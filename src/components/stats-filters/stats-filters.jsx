import React, { useEffect, useState } from 'react';

export default function StatsFilters({
  onStatsFilterTypeChange,
  statsFilterType,
}) {
  const handleStatsFilterClick = (type) => {
    onStatsFilterTypeChange(type);
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
        onClick={(event) => handleStatsFilterClick(event.target.value)}
      />
      <label for='statistic-all-time' className='statistic__filters-label'>
        All time
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-today'
        value='today'
        checked={statsFilterType === 'today'}
        onClick={(event) => handleStatsFilterClick(event.target.value)}
      />
      <label for='statistic-today' className='statistic__filters-label'>
        Today
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-week'
        value='week'
        onClick={(event) => handleStatsFilterClick(event.target.value)}
      />
      <label for='statistic-week' className='statistic__filters-label'>
        Week
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-month'
        value='month'
        onClick={(event) => handleStatsFilterClick(event.target.value)}
      />
      <label for='statistic-month' className='statistic__filters-label'>
        Month
      </label>

      <input
        type='radio'
        className='statistic__filters-input visually-hidden'
        name='statistic-filter'
        id='statistic-year'
        value='year'
        onClick={(event) => handleStatsFilterClick(event.target.value)}
      />
      <label for='statistic-year' className='statistic__filters-label'>
        Year
      </label>
    </form>
  );
}
