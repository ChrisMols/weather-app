import React, { useState, useEffect } from 'react';
import './App.css';

const api = {
  key: '4a4195ebe08fab61f2ed3050ec148e33',
  base: 'https://api.openweathermap.org/data/2.5',
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from local storage on component mount
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    // Save recent searches to local storage whenever it changes
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    fetchWeatherData();
  };

  const fetchWeatherData = () => {
    fetch(`${api.base}/weather?q=${query}&units=metric&appid=${api.key}`)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        setQuery('');

        // Add the search query to recent searches
        const updatedSearches = [query, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
      })
      .catch((error) => {
        console.log('Error fetching weather data:', error);
        setWeather(null);
        setQuery('');
      });
  };

  const handleRecentSearch = (searchQuery) => {
    setQuery(searchQuery);
    fetchWeatherData();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>

        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>

        {recentSearches.length > 0 && (
          <div>
            <h2>Recent Searches:</h2>
            <ul>
              {recentSearches.map((searchQuery, index) => (
                <li key={index}>
                  <button onClick={() => handleRecentSearch(searchQuery)}>
                    {searchQuery}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {weather && (
          <div>
            <h2>{weather.name}</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Condition: {weather.weather[0].description}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;


