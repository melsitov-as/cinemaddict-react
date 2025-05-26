import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { getFilmCardMockData } from './mock/film-card-mock';
import { MOVIES_CARDS_COUNT } from './utils/const';
import { MovieType } from './components/film-card/film-card';
import { store } from './store';

const movies =
  MOVIES_CARDS_COUNT > 0
    ? Array.from({ length: MOVIES_CARDS_COUNT }, getFilmCardMockData)
    : null;
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App movies={movies} />
    </Provider>
  </React.StrictMode>
);
