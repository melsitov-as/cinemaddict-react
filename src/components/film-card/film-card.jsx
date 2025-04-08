import { getDuration, addStatus } from '../../utils/common';
import React, { useState, useEffect } from 'react';

export default function FilmCard({ movie, onClick, onUpdateMovie }) {
  const durationInHM = getDuration(movie.totalDuration);
  const status = addStatus(movie);

  const handleAddToWatchlist = () => {
    onUpdateMovie({ ...movie, isInWatchlist: !movie.isInWatchlist });
  };

  const handleMarkAsWatched = () => {
    onUpdateMovie({ ...movie, isWatched: !movie.isWatched });
  };

  const handleMarkAsFavorite = () => {
    onUpdateMovie({ ...movie, isInFavorites: !movie.isInFavorites });
  };

  return (
    <article className='film-card'>
      <a className='film-card__link'>
        <h3 className='film-card__title'>{movie.title}</h3>
        <p className='film-card__rating'>{movie.rating}</p>
        <p className='film-card__info'>
          <span className='film-card__year'>{movie.year}</span>
          <span className='film-card__duration'>{durationInHM}</span>
          <span className='film-card__genre'>{movie.genre}</span>
        </p>
        <img
          src={`./images/posters/${movie.image}`}
          alt=''
          className='film-card__poster'
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        />
        <p className='film-card__description'>{movie.shortDescription}</p>
        <span className='film-card__comments'>
          {movie.commentsCount} {movie.commentsTitle}
        </span>
      </a>
      <div className='film-card__controls'>
        <button
          className={`film-card__controls-item film-card__controls-item--add-to-watchlist ${status.isInWatchlistActive}`}
          type='button'
          onClick={handleAddToWatchlist}
        >
          Add to watchlist
        </button>
        <button
          className={`film-card__controls-item film-card__controls-item--mark-as-watched ${status.isWatchedActive}`}
          type='button'
          onClick={handleMarkAsWatched}
        >
          Mark as watched
        </button>
        <button
          className={`film-card__controls-item film-card__controls-item--favorite ${status.isInFavoritesActive}`}
          type='button'
          onClick={handleMarkAsFavorite}
        >
          Mark as favorite
        </button>
      </div>
    </article>
  );
}
