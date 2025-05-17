import { Dayjs } from 'dayjs';
import { getDuration, addStatus } from '../../utils/common';
import React, { useState, useEffect, JSX } from 'react';

export type Movie = {
  actors: string[];
  ageRating: string[];
  comments: Comment[];
  commentsCount: number;
  commentsTitle: string;
  country: string;
  dateWatched: Dayjs;
  description: string;
  director: string;
  genre: string[];
  genreTitle: string;
  id: number;
  image: string;
  isInFavorites: boolean;
  isInWatchlist: boolean;
  isMostCommented: boolean;
  isRegular: boolean;
  isTopRated: boolean;
  isWatched: boolean;
  number: number;
  originalTitle: string;
  rating: number;
  releaseDate: Dayjs;
  releaseDateDMY: Dayjs;
  screenwriters: string[];
  shortDescription: string;
  title: string;
  totalDuration: number;
  year: string;
};

type FilmCardProps = {
  movie: Movie;
  onClick: () => void;
  onUpdateMovie: (updatedMovie: Movie) => void;
};

type Status = {
  isInWatchlistActive: boolean;
  isWatchedActive: boolean;
  isInFavoritesActive: boolean;
};

export default function FilmCard({
  movie,
  onClick,
  onUpdateMovie,
}: FilmCardProps): JSX.Element {
  console.log(movie);

  const durationInHM: string = getDuration(movie.totalDuration);
  const status: Status = addStatus(movie);

  const handleAddToWatchlist: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    onUpdateMovie({ ...movie, isInWatchlist: !movie.isInWatchlist });
  };

  const handleMarkAsWatched: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    onUpdateMovie({ ...movie, isWatched: !movie.isWatched });
  };

  const handleMarkAsFavorite: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
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
          src={`/images/posters/${movie.image}`}
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
