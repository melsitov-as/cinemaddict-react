import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // Важно: импортируйте 'chart.js/auto' для регистрации всех контроллеров и плагинов
import { GENRES_LIST } from '../mock/film-card-mock';
import StatsFilters from '../components/stats-filters/stats-filters';
import dayjs from 'dayjs';

export default function Stats({ movies }) {
  const chartRef = useRef(null);
  const [statsFilterType, setStatsFilterType] = useState('all-time'); // Default filter type
  const [statsFilteredMovies, setStatsFilteredMovies] = useState(
    movies.filter((movie) => movie.dateWatched)
  );

  const getEmptyGenres = () => {
    let genresObj = GENRES_LIST.reduce((accumulator, currentValue) => {
      accumulator[currentValue.slice(1)] = 0;
      return accumulator;
    }, {});
    return genresObj;
  };

  const filterByTime = (filterType) => {
    switch (filterType) {
      case 'today':
        const today = dayjs().startOf('day');
        const filteredTodayMovies = movies
          .filter((movie) => movie.isWatched)
          .filter((movie) => {
            const movieDateWatched = dayjs(movie.dateWatched).startOf('day');
            return movieDateWatched.isSame(today, 'day'); // Проверяем, является ли дата просмотра сегодняшней
          });
        console.log(filteredTodayMovies);
        // Возможно, здесь вы захотите обновить состояние:
        setStatsFilteredMovies(filteredTodayMovies);
        break;
      case 'week':
        const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day');
        const filteredLastWeekMovies = movies
          .filter((movie) => movie.isWatched)
          .filter((movie) => {
            const movieDateWatched = dayjs(movie.dateWatched).startOf('day');
            return movieDateWatched.isAfter(oneWeekAgo);
            // Альтернативный вариант с isBetween (включая сегодняшний день):
            // const today = dayjs().endOf('day');
            // return movieDateWatched.isBetween(oneMonthAgo, today, null, '[]');
          });
        // Возможно, здесь вы захотите обновить состояние:
        setStatsFilteredMovies(filteredLastWeekMovies);
        break;
      case 'month':
        const oneMonthAgo = dayjs().subtract(30, 'day').startOf('day');
        const filteredLastMonthMovies = movies
          .filter((movie) => movie.isWatched)
          .filter((movie) => {
            const movieDateWatched = dayjs(movie.dateWatched).startOf('day');
            return movieDateWatched.isAfter(oneMonthAgo);
            // Альтернативный вариант с isBetween (включая сегодняшний день):
            // const today = dayjs().endOf('day');
            // return movieDateWatched.isBetween(oneMonthAgo, today, null, '[]');
          });
        // Возможно, здесь вы захотите обновить состояние:
        setStatsFilteredMovies(filteredLastMonthMovies);
        break;
      case 'year':
        const oneYearAgo = dayjs().subtract(365, 'day').startOf('day');
        const filteredLastYearMovies = movies
          .filter((movie) => movie.isWatched)
          .filter((movie) => {
            const movieDateWatched = dayjs(movie.dateWatched).startOf('day');
            return movieDateWatched.isAfter(oneYearAgo);
            // Альтернативный вариант с isBetween (включая сегодняшний день):
            // const today = dayjs().endOf('day');
            // return movieDateWatched.isBetween(oneMonthAgo, today, null, '[]');
          });
        // Возможно, здесь вы захотите обновить состояние:
        setStatsFilteredMovies(filteredLastYearMovies);
        break;
      default:
        setStatsFilteredMovies(movies.filter((movie) => movie.dateWatched));
        break;
    }
  };

  useEffect(() => {
    filterByTime(statsFilterType);
  }, [statsFilterType]);

  useEffect(() => {
    const statisticCtx = chartRef.current.getContext('2d');

    const renderFilmsChart = new Chart(statisticCtx, {
      type: 'bar',
      data: {
        labels: ['Drama', 'Mystery', 'Comedy', 'Cartoon', 'Western', 'Musical'],
        datasets: [
          {
            label: '# of Movies',
            data: [
              initialGenreCounts.Drama,
              initialGenreCounts.Mystery,
              initialGenreCounts.Comedy,
              initialGenreCounts.Cartoon,
              initialGenreCounts.Western,
              initialGenreCounts.Musical,
            ],
            borderWidth: 1,
            barThickness: 24,
            backgroundColor: '#ffe800',
            hoverBackgroundColor: '#ffe800',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white', // Измените 'blue' на желаемый цвет
              font: {
                size: 14, // Дополнительно можно изменить размер шрифта
              },
              // Другие настройки ticks
            },
            title: {
              // Настройка заголовка оси Y (если нужен)
              display: true,
              text: 'Movies',
              color: 'white', // Измените 'green' на желаемый цвет заголовка
              font: {
                size: 16,
              },
            },
          },
          x: {
            // Пример настройки цвета текста меток оси X (если есть)
            ticks: {
              color: 'white',
            },
            title: {
              display: true,
              text: 'Number of Movies',
              color: 'white',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
      },
    });

    return () => {
      if (renderFilmsChart) {
        renderFilmsChart.destroy();
      }
    };
  }, [statsFilteredMovies]);

  const initialGenreCounts = getEmptyGenres();

  // Усовершенствованный код подсчета жанров
  statsFilteredMovies.forEach((movie) => {
    if (movie.genre && Array.isArray(movie.genre) && movie.isWatched) {
      movie.genre.forEach((genre) => {
        const clicedGenre = genre.slice(1);
        if (initialGenreCounts.hasOwnProperty(clicedGenre)) {
          initialGenreCounts[clicedGenre]++;
        }
      });
    }
  });

  const watched = statsFilteredMovies;

  const getDurationInHandM = (data) => ({
    hours: Math.floor(data / 60),
    minutes: data % 60,
  });

  const getTotalWatchedDuration = () => {
    return statsFilteredMovies
      .filter((movie) => movie.isWatched)
      .reduce((acc, curr) => {
        return acc + curr.totalDuration;
      }, 0);
  };

  const totalWatchedDuration = getDurationInHandM(getTotalWatchedDuration());

  const handleStatsFilterTypeChange = (type) => {
    setStatsFilterType(type);
  };

  const topGenre = (function (obj) {
    return Object.entries(obj).reduce((maxEntry, currentEntry) => {
      // Сравниваем значения текущей записи с записью с наибольшим значением
      return currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry;
    })[0]; // Возвращаем ключ (первый элемент пары)
  })(initialGenreCounts);

  return (
    <>
      <section className='statistic'>
        <p className='statistic__rank'>
          Your rank
          <img
            className='statistic__img'
            src='images/bitmap@2x.png'
            alt='Avatar'
            width='35'
            height='35'
          />
          <span className='statistic__rank-label'>Movie buff</span>
        </p>

        <StatsFilters
          onStatsFilterTypeChange={handleStatsFilterTypeChange}
          statsFilterType={statsFilterType}
        />

        <ul className='statistic__text-list'>
          <li className='statistic__text-item'>
            <h4 className='statistic__item-title'>You watched</h4>
            <p className='statistic__item-text'>
              {watched.length}{' '}
              <span className='statistic__item-description'>movies</span>
            </p>
          </li>
          <li className='statistic__text-item'>
            <h4 className='statistic__item-title'>Total duration</h4>
            <p className='statistic__item-text'>
              {totalWatchedDuration.hours}{' '}
              <span className='statistic__item-description'>h</span>{' '}
              {totalWatchedDuration.minutes}{' '}
              <span className='statistic__item-description'>m</span>
            </p>
          </li>
          <li className='statistic__text-item'>
            <h4 className='statistic__item-title'>Top genre</h4>
            <p className='statistic__item-text'>{topGenre}</p>
          </li>
        </ul>

        <div className='statistic__chart-wrap'>
          <canvas
            className='statistic__chart'
            width='1000'
            ref={chartRef}
          ></canvas>
        </div>
      </section>
    </>
  );
}
