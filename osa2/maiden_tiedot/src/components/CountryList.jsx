import React from 'react';

const CountryList = ({countries, setSearch}) => {
    return (
        <>
            {countries.map(country => 
                <div key={country.cca3}>
                    <p>{country.name.common}</p>
                    <button onClick={() => setSearch(country.name.common)}>vilauta</button>
                </div>
            )}
        </>
    )
}

export default CountryList;