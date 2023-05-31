import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
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
    const storedRecentSearches = Cookies.get('recentSearches');
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query) {
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

        const updatedSearches = [searchQuery, ...recentSearches.slice(0, 4)];
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
    fetchWeatherData(searchQuery);
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

        {weather && weather.main &&(
          <div>
            <h2>{weather.name}</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Condition: {weather.weather[0].description}</p>
            <p>Feels Like: {weather.main.feels_like}°C</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;



