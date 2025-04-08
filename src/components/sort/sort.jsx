import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Sort({ onSortTypeChange }) {
  const [activeSortType, setActiveSortType] = useState('default');

  const handleSortClick = (type) => {
    setActiveSortType(type);
    onSortTypeChange(type);
  };

  return (
    <ul className='sort'>
      <li>
        <a
          href='#sort-default'
          className={`sort__button ${
            activeSortType === 'default' ? 'sort__button--active' : ''
          }`}
          onClick={() => handleSortClick('default')}
        >
          Sort by default
        </a>
      </li>
      <li>
        <a
          href='#sort-date'
          className={`sort__button ${
            activeSortType === 'date' ? 'sort__button--active' : ''
          }`}
          onClick={() => handleSortClick('date')}
        >
          Sort by date
        </a>
      </li>
      <li>
        <a
          href='#sort-rating'
          className={`sort__button ${
            activeSortType === 'rating' ? 'sort__button--active' : ''
          }`}
          onClick={() => handleSortClick('rating')}
        >
          Sort by rating
        </a>
      </li>
      <li>
        <a
          href='#sort-comments'
          className={`sort__button ${
            activeSortType === 'comment' ? 'sort__button--active' : ''
          }`}
          onClick={() => handleSortClick('comments')}
        >
          Sort by comments
        </a>
      </li>
    </ul>
  );
}
