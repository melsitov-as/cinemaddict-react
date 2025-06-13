import { JSX } from 'react';
import { MovieType } from '../film-card/film-card';

type FooterProps = {
  movies?: MovieType[] | null;
};

export default function Footer({ movies }: FooterProps): JSX.Element {
  const getMoviesCount = (
    moviesProp: MovieType[] | null | undefined
  ): number => {
    return moviesProp?.length ?? 0;
  };

  // Вычисляем длину, используя новую функцию
  const count = getMoviesCount(movies);
  const stringWithCount =
    count + ` ${count === 1 ? 'movie' : 'movies'} ` + 'inside';

  return (
    <div>
      <footer className='footer'>
        <section className='footer__logo logo logo--smaller'>
          Cinemaddict
        </section>
        <section className='footer__statistics'>
          <p>{stringWithCount}</p>
        </section>
      </footer>
    </div>
  );
}
