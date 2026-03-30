import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, fetchBookmarks } from '../features/movieSlice';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

const MoviesPage = () => {
    const dispatch = useDispatch();
    const { movies, status, error } = useSelector((state) => state.movie);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchMovies());
        dispatch(fetchBookmarks());
    }, [dispatch]);

    const filteredMovies = movies.filter((item) => 
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in slide-in-from-bottom duration-500">
            <SearchBar setSearchQuery={setSearchQuery} placeholder="Search for movies" />
            <section>
                <h2 className="text-2xl lg:text-3xl font-light mb-6 tracking-tight">
                    {searchQuery ? `Found ${filteredMovies.length} results for '${searchQuery}'` : 'Movies'}
                </h2>
                
                {status === 'loading' && (
                    <div className="text-center py-12">
                        <p className="text-grey">Loading movies...</p>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-300">Error: {error}</p>
                        <p className="text-sm text-grey mt-2">Check the browser console for more details</p>
                    </div>
                )}
                
                {movies.length === 0 && status !== 'loading' && !error && (
                    <div className="text-center py-12">
                        <p className="text-grey">No movies to display. Make sure TMDB API key is configured.</p>
                    </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                    {filteredMovies.map((item) => (
                        <MovieCard key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MoviesPage;
