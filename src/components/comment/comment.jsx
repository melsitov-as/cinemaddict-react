import he from 'he';

export default function Comment({ comment, onDelete }) {
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
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
          >
            Delete
          </button>
        </p>
      </div>
    </li>
  );
}
