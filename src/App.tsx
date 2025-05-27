import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main-page';
import NotFoundPage from './pages/not-found-page';
import Stats from './pages/stats';
import MainLayout from './layouts/main-layout';
import { MovieType } from './components/film-card/film-card';

type AppProps = {
  movies: MovieType[] | null;
};

function App({ movies }: AppProps) {
  // return <MainPage movies={movies} />;

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<MainPage movies={movies} />} /> */}
        <Route path='/cinemaaddict-react' element={<MainLayout />}>
          <Route path='' element={<MainPage />} />
          <Route path='stats' element={<Stats movies={movies} />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
