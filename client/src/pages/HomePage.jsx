import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchBookmarks } from '../features/movieSlice';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const dispatch = useDispatch();
  const { trending, status, error } = useSelector((state) => state.movie);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchBookmarks());
  }, [dispatch]);

  const filteredTrending = trending.filter((item) => 
    (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-700">
      <SearchBar setSearchQuery={setSearchQuery} />
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-300">Error: {error}</p>
          <p className="text-sm text-grey mt-2">Check the browser console for more details. Make sure TMDB API key is configured.</p>
        </div>
      )}
      
      {!searchQuery && (
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-light mb-6">Trending</h2>
          {status === 'loading' ? (
            <p className="text-centre text-grey">Loading trending content...</p>
          ) : trending.length === 0 ? (
            <p className="text-grey">No trending content available</p>
          ) : (
            <div className="flex gap-4 lg:gap-10 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {trending.slice(0, 10).map((item) => (
                  <div key={item.id} className="min-w-[300px] lg:min-w-[470px] hover:scale-[1.02] transition-transform duration-300">
                      <MovieCard item={item} />
                  </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="text-2xl lg:text-3xl font-light mb-6 tracking-tight">
            {searchQuery ? `Found ${filteredTrending.length} results for '${searchQuery}'` : 'Recommended for you'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
            {filteredTrending.map((item) => (
                <MovieCard key={item.id} item={item} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
