import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks } from '../features/movieSlice';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

const BookmarksPage = () => {
    const dispatch = useDispatch();
    const { bookmarks, status, error } = useSelector((state) => state.movie);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchBookmarks());
    }, [dispatch]);

    const filteredBookmarks = bookmarks.filter((item) => 
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const bookmarkedMovies = filteredBookmarks.filter(item => item.mediaType === 'movie');
    const bookmarkedTV = filteredBookmarks.filter(item => item.mediaType === 'tv');

    return (
        <div className="animate-in fade-in duration-500">
            <SearchBar setSearchQuery={setSearchQuery} placeholder="Search for bookmarked shows" />
            
            {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-red-300">Error: {error}</p>
                    <p className="text-sm text-grey mt-2">Check browser console for details</p>
                </div>
            )}
            
            <section className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-light mb-6 tracking-tight">
                    {searchQuery ? `Found ${bookmarkedMovies.length} bookmarked movies for '${searchQuery}'` : 'Bookmarked Movies'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                    {bookmarkedMovies.map((item) => (
                        <MovieCard key={item.mediaId} item={item} />
                    ))}
                </div>
                {bookmarkedMovies.length === 0 && !searchQuery && <p className="text-grey/60 italic text-lg">Your movie library is empty.</p>}
            </section>

            <section>
                <h2 className="text-2xl lg:text-3xl font-light mb-6 tracking-tight">
                    {searchQuery ? `Found ${bookmarkedTV.length} bookmarked TV series for '${searchQuery}'` : 'Bookmarked TV Series'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                    {bookmarkedTV.map((item) => (
                        <MovieCard key={item.mediaId} item={item} />
                    ))}
                </div>
                {bookmarkedTV.length === 0 && !searchQuery && <p className="text-grey/60 italic text-lg">Your TV series library is empty.</p>}
            </section>
        </div>
    );
};

export default BookmarksPage;
