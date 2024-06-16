import React, { useEffect, useState } from 'react';
import Search from './components/Search';

const App = () => {

  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  const hook = () => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        try {
          setCountries(response.data)
          console.log('Maat haetttu')
        } catch (error) {
          console.log('Wallahi veli ei toimi bro',error)
        }
      }), useEffect(hook, [])
  }

  return (
    <div>
      <h1>Maiden tiedot</h1>
      <Search search={search} setSearch={setSearch} />
    </div>
  );
};

export default App;
