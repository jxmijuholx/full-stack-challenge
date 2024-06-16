import React from 'react';

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
    </div>
  );
};

export default Country;
