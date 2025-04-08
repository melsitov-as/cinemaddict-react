import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main-page';
import NotFoundPage from './pages/not-found-page';
import Stats from './pages/stats';
import MainLayout from './layouts/main-layout';

function App({ movies }) {
  // return <MainPage movies={movies} />;

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<MainPage movies={movies} />} /> */}
        <Route path='/' element={<MainLayout movies={movies} />}>
          <Route path='' element={<MainPage />} />
          <Route path='stats' element={<Stats movies={movies} />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
