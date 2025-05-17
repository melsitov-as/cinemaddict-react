import { JSX, MouseEventHandler, useState } from 'react';

export type SortType = 'default' | 'date' | 'rating' | 'comments';

type SortProps = {
  onSortTypeChange: (type: React.SetStateAction<SortType>) => void;
};

export default function Sort({ onSortTypeChange }: SortProps): JSX.Element {
  const [activeSortType, setActiveSortType] = useState<SortType>('default');

  const handleSortClick = (type: React.SetStateAction<SortType>) => {
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
            activeSortType === 'comments' ? 'sort__button--active' : ''
          }`}
          onClick={() => handleSortClick('comments')}
        >
          Sort by comments
        </a>
      </li>
    </ul>
  );
}
