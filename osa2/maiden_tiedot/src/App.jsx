import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Country from './components/Country';
import CountryList from './components/CountryList';
import Search from './components/Search';
import YouTubeVideo from './components/YoutubeEmbed';

const App = () => {

  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  useEffect(() => {
    setFilteredCountries(
      countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, countries]);


  return (
    <div>
      <h1>Maiden tiedot</h1>
      <h2>The design is very human!</h2>
      <Search search={search} setSearch={setSearch} />
      {filteredCountries.length > 10 && (
        <div>Too many matches ;) ...said no one ever</div>
      )}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <CountryList countries={filteredCountries} setSearch={setSearch} />
      )}
      {filteredCountries.length === 1 && (
        <Country country={filteredCountries[0]}
         />
      )
      }
      {filteredCountries.length === 1 && filteredCountries[0].name.common === 'Jamaica' &&(
        <YouTubeVideo  />
      )
      }
    </div>
  );
};

export default App;
