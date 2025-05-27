import he from 'he';
import React, { JSX } from 'react';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../../store/action';

export type CommentType = {
  id: string;
  emoji: string;
  text: string;
  author: string;
  date: string;
};

type CommentProps = {
  comment: CommentType;
  onDelete: (id: string) => void;
};

export default function Comment({
  comment,
  onDelete,
}: CommentProps): JSX.Element {
  const dispatch = useDispatch();

  const handleDeleteClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(deleteComment({ id: comment.id }));
  };

  return (
    <li className='film-details__comment'>
      <span className='film-details__comment-emoji'>
        <img
          src={`./images/emoji/${comment.emoji}.png`}
          width='55'
          height='55'
          // alt='emoji-smile'
          alt={`emoji-${comment.emoji}`}
        />
      </span>
      <div>
        <p className='film-details__comment-text'>{he.decode(comment.text)}</p>
        <p className='film-details__comment-info'>
          <span className='film-details__comment-author'>{comment.author}</span>
          <span className='film-details__comment-day'>{comment.date}</span>
          <button
            className='film-details__comment-delete'
            onClick={handleDeleteClick}
            type='button'
          >
            Delete
          </button>
        </p>
      </div>
    </li>
  );
}
