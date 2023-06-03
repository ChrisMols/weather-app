import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';

const api = {
  key: '4a4195ebe08fab61f2ed3050ec148e33',
  base: 'https://api.openweathermap.org/data/2.5',
};

function SearchBox({ query, handleInputChange, handleKeyUp}) {
  return (
    <div className="search-box">
      <input className="app-input" type="text" placeholder="What city are you looking for?"
      value={query}
      onChange={handleInputChange}
      onKeyUp={handleKeyUp}
      />
    </div>
  )
}

function WeatherResult({ weather }) {
  return (
    <div className="app-weather-result">
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>Condition: {weather.weather[0].description}</p>
      <p>Feels Like: {weather.main.feels_like}°C</p>
    </div>
  )
}

function RecentSearches({recentSearches, handleRecentSearch}) {
  return (
    <div className="recent-searches-container">
      <h2>Recent Searches:</h2>
      <ul>
        {recentSearches.map((searchQuery, index) => (
          <li className="app-recent-search-li" key={index}>
            <button className="App-recent-search-button" 
            onClick={() => handleRecentSearch(searchQuery)}>
              {searchQuery}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WeatherMap({ latitude, longtitude}) {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longtitude}&z=10&output=embed`;

  return (
    <div className="map-container">
      <iframe title="Map" width="100%" height="300" frameborder="0" src={mapUrl}></iframe>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const storedRecentSearches = Cookies.get('recentSearches');
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = () => {
    if (query) {

      const isAlreadySearched = recentSearches.includes(query);
      if (!isAlreadySearched) {

      const updatedRecentSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedRecentSearches);
      Cookies.set('recentSearches', JSON.stringify(updatedRecentSearches), { expires: 7 });
      
      setQuery(''); // Clear the search input field
      fetchWeatherData(query); // Fetch weather data immediately after updating recent searches and query
    }
  };
  

  const fetchWeatherData = (searchQuery) => {
    const encodedQuery = encodeURIComponent (searchQuery);
    fetch(`${api.base}/weather?q=${encodedQuery}&units=metric&appid=${api.key}`)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        setQuery('');

        const isAlreadySearched = recentSearches.includes(searchQuery);
        if (!isAlreadySearched) {

        const updatedSearches = [searchQuery, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        }
      })
      .catch((error) => {
        console.log('Error fetching weather data:', error);
        setWeather(null);
        setQuery('');
      });
  };

  const handleRecentSearch = (searchQuery) => {
    const isAlreadySearched = recentSearches.includes(searchQuery);
    if (!isAlreadySearched) {
    setQuery(searchQuery);
    fetchWeatherData(searchQuery);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>

        <SearchBox
          query={query}
          handleInputChange={handleInputChange}
          handleKeyUp={handleKeyUp}
        />

        {recentSearches.length > 0 && (
          <RecentSearches
            recentSearches={recentSearches}
            handleRecentSearch={handleRecentSearch}
          />
        )}

        {weather && weather.main && (
          <>
            <WeatherResult weather={weather} />
            <WeatherMap latitude={weather.coord.lat} longtitude={weather.coord.lon}/>
          </>
        )}
      </header>
    </div>
  );
}

export default App;



