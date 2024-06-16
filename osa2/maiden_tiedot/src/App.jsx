import React, { useState } from 'react';
import Search from './components/Search';

const App = () => {

  const [search, setSearch] = useState('')

  return (
    <div>
      <h1>Maiden tiedot</h1>
      <Search search={search} setSearch={setSearch} />
    </div>
  );
};

export default App;
