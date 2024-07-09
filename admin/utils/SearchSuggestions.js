// components/SearchSuggestions.js

import React, { useState } from 'react';

const SearchSuggestions = ({ data, searchKey }) => {
  const [query, setQuery] = useState('');

  // Function to handle changes in the search input
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  // Filter the data based on the current query and the specified search key
  const filteredData = data.filter(item => item[searchKey].toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <input type="text" placeholder="Search..." value={query} onChange={handleChange} />
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>{item[searchKey]}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
