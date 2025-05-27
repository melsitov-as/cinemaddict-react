import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSortType } from '../../store/action';

export type SortType = 'default' | 'date' | 'rating' | 'comments';

export default function Sort(): JSX.Element {
  const activeSortType = useAppSelector((state) => state.sortType);
  const dispatch = useAppDispatch();

  const handleSortClick = (type: SortType) => {
    dispatch(setSortType({ sortType: type }));
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
