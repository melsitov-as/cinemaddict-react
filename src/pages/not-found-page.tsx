import React, { JSX } from 'react';
import Header from '../components/header/header';
import FilmsListTitle from '../components/films-list-title/films-list-title';
import Footer from '../components/footer/footer';
import { Link } from 'react-router-dom';

export default function NotFoundPage(): JSX.Element {
  return (
    <div>
      <Header />

      <main className='main'>
        <section className='films'>
          <section className='films-list'>
            <FilmsListTitle
              text={'404. Страница не найдена...'}
              isVisible={true}
            />
            <h3 className='underline-link'>
              <Link to={'/'}>Вернуться на главную страницу</Link>
            </h3>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
