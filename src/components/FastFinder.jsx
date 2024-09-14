import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'; 
import './FastFinder.css';

const FastFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/countries.json');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredResults([]);
    } else {
      const lowercasedFilter = e.target.value.toLowerCase();
      const results = countries.filter(
        (country) =>
          country.country.toLowerCase().includes(lowercasedFilter) ||
          country.capital.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredResults(results);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: { results: filteredResults } });
  };

  return (
    <div className="container">
      <h2 className="title">Fast Finder</h2>
      <p className="intro-text">
        Welcome to Fast Finder! Quickly search for countries by name or capital city.
      </p>
      <p className="instructions-text">
        Type a country name or capital, and watch the results appear instantly!
      </p>
      {loading ? (
        <div className="loading">
          <ThreeDots 
            height="80" 
            width="80" 
            color="#007bff" 
            ariaLabel="loading"
          />
        </div>
      ) : (
        <form onSubmit={handleSearchSubmit} className="search-form">
          <img src={`${process.env.PUBLIC_URL}/search-icon.png`} alt="Logo" className="logo" />
          <input
            type="text"
            placeholder="Search by country or capital..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search input"
          />
          <button type="submit" className="search-button" aria-label="Search button">Search</button>
        </form>
      )}
      <div className="results">
        {filteredResults.length > 0 && (
          filteredResults.map((country, index) => (
            <div key={index} className="result-item">
              <span className="country-name">{country.country}</span>
              <span className="capital-name">{country.capital}</span>
            </div>
          ))
        )}
        {searchTerm && filteredResults.length === 0 && (
          <div className="no-results">No results found for "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
};

export default FastFinder;
