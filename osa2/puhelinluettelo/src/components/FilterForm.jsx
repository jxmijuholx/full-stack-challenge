import React from 'react';

const FilterForm = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with 
    <input value={filter} onChange={handleFilterChange} />
  </div>
);

export default FilterForm;
