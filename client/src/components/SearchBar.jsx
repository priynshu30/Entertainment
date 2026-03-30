import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ setSearchQuery, placeholder }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Search className="text-white w-6 h-6 md:w-8 md:h-8" />
      <input 
        type="text" 
        placeholder={placeholder || "Search for movies or TV series"}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-transparent border-none outline-none text-xl md:text-2xl font-light w-full placeholder:text-grey/50 focus:border-b focus:border-grey transition-all pb-3"
      />
    </div>
  );
};

export default SearchBar;
