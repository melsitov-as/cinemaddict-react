import React, { JSX, KeyboardEventHandler, useEffect, useState } from 'react';
import Comment from '../comment/comment';
import { getDuration, addPopupStatus, CardStatus } from '../../utils/common';
import he from 'he';
import { MovieType } from '../film-card/film-card';
import {
  addComment,
  toggleIsInFavorites,
  toggleIsInWatchlist,
  toggleIsWatched,
} from '../../store/action';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks';

type PopupProps = {
  onClose: () => void;
  onUpdateMovie: (updatedMovie: MovieType) => void;
};

interface IEmojiStyles {
  smile: React.CSSProperties;
  sleeping: React.CSSProperties;
  puke: React.CSSProperties;
  angry: React.CSSProperties;
}

export default function Popup({
  onClose,
  onUpdateMovie,
}: PopupProps): JSX.Element {
  const dispatch = useDispatch();

  const movie = useAppSelector((state) => state.currentFilmCard);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentEmoji, setNewCommentEmoji] = useState<string | null>(null); // Default emoji
  const durationInHM: string = getDuration(movie?.totalDuration);
  const status = addPopupStatus(movie);

  const emojiStyles: IEmojiStyles = {
    smile: {
      position: 'absolute',
      top: 'calc(50% - 25px)',
      left: 'calc(50% - 25px)',
    },
    sleeping: {
      position: 'absolute',
      top: 'calc(50% - 25px)',
      left: 'calc(50% - 23px)',
      width: '50px',
      height: '50px',
    },
    puke: {
      position: 'absolute',
      top: 'calc(50% - 25px)',
      left: 'calc(50% - 27px)',
      width: '52px',
      height: '52px',
    },
    angry: {
      position: 'absolute',
      top: 'calc(50% - 25px)',
      left: 'calc(50% - 25px)',
    },
  };

  const handleAddToWatchlist: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatch(toggleIsInWatchlist({ id: movie?.id }));
  };

  const handleMarkAsWatched: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatch(toggleIsWatched({ id: movie?.id }));
  };

  const handleMarkAsFavorite: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatch(toggleIsInFavorites({ id: movie?.id }));
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = movie?.comments?.filter(
      (comment) => comment.id !== commentId
    );
    const updatedMovie = {
      ...movie,
      comments: updatedComments,
      commentsCount: updatedComments?.length,
    };
    onUpdateMovie(updatedMovie);
  };

  const handleAddComment = () => {
    const sanitizedCommentText = he.encode(newCommentText);

    if (newCommentText.trim()) {
      const newComment: any = {
        id: String(Date.now()),
        author: 'Your Name',
        text: sanitizedCommentText,
        date: new Date().toLocaleDateString(),
        emoji: newCommentEmoji,
      };

      const updatedMovie = {
        ...movie,
      };
      dispatch(addComment({ newComment: newComment }));
      setNewCommentText('');
      setNewCommentEmoji(null);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddComment();
    }
  };

  const getStyles = (newCommentEmoji: string) => {
    switch (newCommentEmoji) {
      case 'smile':
        return emojiStyles.smile;
      case 'sleeping':
        return emojiStyles.sleeping;
      case 'puke':
        return emojiStyles.puke;
      case 'angry':
        return emojiStyles.angry;
    }
  };

  return (
    <section className='film-details'>
      <form className='film-details__inner' action='' method='get'>
        <div className='film-details__top-container'>
          <div className='film-details__close'>
            <button
              className='film-details__close-btn'
              type='button'
              onClick={onClose}
            >
              close
            </button>
          </div>
          <div className='film-details__info-wrap'>
            <div className='film-details__poster'>
              <img
                className='film-details__poster-img'
                src={`/cinemaaddict-react/images/posters/${movie?.image}`}
                alt=''
              />

              <p className='film-details__age'>{movie?.ageRating}</p>
            </div>

            <div className='film-details__info'>
              <div className='film-details__info-head'>
                <div className='film-details__title-wrap'>
                  <h3 className='film-details__title'>{movie?.title}</h3>
                  <p className='film-details__title-original'>
                    {movie?.originalTitle}
                  </p>
                </div>

                <div className='film-details__rating'>
                  <p className='film-details__total-rating'>{movie?.rating}</p>
                </div>
              </div>

              <table className='film-details__table'>
                <tbody>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>Director</td>
                    <td className='film-details__cell'>{movie?.director}</td>
                  </tr>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>Writers</td>
                    <td className='film-details__cell'>
                      {movie?.screenwriters}
                    </td>
                  </tr>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>Actors</td>
                    <td className='film-details__cell'>{movie?.actors}</td>
                  </tr>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>Release Date</td>
                    <td className='film-details__cell'>
                      {movie?.releaseDateDMY}
                    </td>
                  </tr>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>Runtime</td>
                    <td className='film-details__cell'>{durationInHM}</td>
                  </tr>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>Country</td>
                    <td className='film-details__cell'>{movie?.country}</td>
                  </tr>
                  <tr className='film-details__row'>
                    <td className='film-details__term'>{movie?.genreTitle}</td>
                    <td className='film-details__cell'>{movie?.genre}</td>
                  </tr>
                </tbody>
              </table>

              <p className='film-details__film-description'>
                {movie?.description}
              </p>
            </div>
          </div>

          <section className='film-details__controls'>
            <button
              type='button'
              className={`film-details__control-button film-details__control-button--watchlist ${status.isInWatchlistActive}`}
              id='watchlist'
              name='watchlist'
              onClick={handleAddToWatchlist}
            >
              Add to watchlist
            </button>
            <button
              type='button'
              className={`film-details__control-button film-details__control-button--watched ${status.isWatchedActive}`}
              id='watched'
              name='watched'
              onClick={handleMarkAsWatched}
            >
              Already watched
            </button>
            <button
              type='button'
              className={`film-details__control-button film-details__control-button--favorite ${status.isInFavoritesActive}`}
              id='favorite'
              name='favorite'
              onClick={handleMarkAsFavorite}
            >
              Add to favorites
            </button>
          </section>
        </div>

        <div className='film-details__bottom-container'>
          <section className='film-details__comments-wrap'>
            <h3 className='film-details__comments-title'>
              Comments{' '}
              <span className='film-details__comments-count'>
                {movie?.commentsCount}
              </span>
            </h3>
            <ul className='film-details__comments-list'>
              {movie?.comments?.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </ul>

            <div className='film-details__new-comment'>
              <div
                className='film-details__add-emoji-label'
                style={{
                  position: 'relative',
                }}
              >
                {newCommentEmoji && (
                  <img
                    src={`/cinemaaddict-react/images/emoji/${newCommentEmoji}.png`}
                    width='50px'
                    height='50px'
                    alt='emoji'
                    style={getStyles(newCommentEmoji)}
                  />
                )}
              </div>

              <label className='film-details__comment-label'>
                <textarea
                  className='film-details__comment-input'
                  placeholder='Select reaction below and write comment here'
                  name='comment'
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                ></textarea>
              </label>

              <div className='film-details__emoji-list'>
                <input
                  className='film-details__emoji-item visually-hidden'
                  name='smile'
                  type='radio'
                  id='emoji-smile'
                  value='smile'
                  checked={newCommentEmoji === 'smile'}
                  onChange={() => setNewCommentEmoji('smile')}
                />
                <label
                  className='film-details__emoji-label'
                  htmlFor='emoji-smile'
                >
                  <img
                    src='/cinemaaddict-react/images/emoji/smile.png'
                    width='30'
                    height='30'
                    alt='emoji-smile'
                  />
                  <span className='visually-hidden'>smile</span>
                </label>

                <input
                  className='film-details__emoji-item visually-hidden'
                  name='sleeping'
                  type='radio'
                  id='emoji-sleeping'
                  value='sleeping'
                  checked={newCommentEmoji === 'sleeping'}
                  onChange={() => setNewCommentEmoji('sleeping')}
                />
                <label
                  className='film-details__emoji-label'
                  htmlFor='emoji-sleeping'
                >
                  <img
                    src='/cinemaaddict-react/images/emoji/sleeping.png'
                    width='30'
                    height='30'
                    alt='emoji-sleeping'
                  />
                  <span className='visually-hidden'>sleeping</span>
                </label>

                <input
                  className='film-details__emoji-item visually-hidden'
                  name='puke'
                  type='radio'
                  id='emoji-puke'
                  value='puke'
                  checked={newCommentEmoji === 'puke'}
                  onChange={() => setNewCommentEmoji('puke')}
                />
                <label
                  className='film-details__emoji-label'
                  htmlFor='emoji-puke'
                >
                  <img
                    src='/cinemaaddict-react/images/emoji/puke.png'
                    width='30'
                    height='30'
                    alt='emoji-puke'
                  />
                  <span className='visually-hidden'>puke</span>
                </label>

                <input
                  className='film-details__emoji-item visually-hidden'
                  name='angry'
                  type='radio'
                  id='emoji-angry'
                  value='angry'
                  checked={newCommentEmoji === 'angry'}
                  onChange={() => setNewCommentEmoji('angry')}
                />
                <label
                  className='film-details__emoji-label'
                  htmlFor='emoji-angry'
                >
                  <img
                    src='/cinemaaddict-react/images/emoji/angry.png'
                    width='30'
                    height='30'
                    alt='emoji-angry'
                  />
                  <span className='visually-hidden'>angry</span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  );
}
