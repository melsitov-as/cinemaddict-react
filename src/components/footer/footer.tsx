import { JSX } from 'react';
import { Movie } from '../film-card/film-card';

type FooterProps = {
  movies: Movie[];
};

export default function Footer({ movies }: FooterProps): JSX.Element {
  return (
    <div>
      <footer className='footer'>
        <section className='footer__logo logo logo--smaller'>
          Cinemaddict
        </section>
        <section className='footer__statistics'>
          <p>
            {movies.length} {`${movies.length === 1 ? 'movie' : 'movies'}`}{' '}
            inside
          </p>
        </section>
      </footer>
    </div>
  );
}
