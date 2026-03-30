import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, markMovieAsSeen } from '../features/movieSlice';
import { Bookmark, Film, Tv, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookmarks } = useSelector((state) => state.movie);
  const bookmark = bookmarks.find(b => b.mediaId === String(item.id || item.mediaId));
  const isBookmarked = bookmark?.isBookmarked;
  const isSeen = bookmark?.isSeen;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const mediaType = item.media_type || (item.first_air_date || item.mediaType === 'tv' ? 'tv' : 'movie');
    dispatch(toggleBookmark({
        mediaId: String(item.id || item.mediaId),
        mediaType: mediaType,
        title: item.title || item.name,
        thumbnail: item.backdrop_path || item.poster_path || item.thumbnail,
        year: (item.release_date || item.first_air_date || '').split('-')[0] || item.year,
        rating: item.adult ? '18+' : 'PG'
    }));
  };

  const handleMarkAsSeen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      dispatch(markMovieAsSeen({
        mediaId: String(item.id || item.mediaId),
        isSeen: !isSeen
      }));
    }
  };

  const handleNavigate = () => {
    const type = item.media_type || (item.first_air_date || item.mediaType === 'tv' ? 'tv' : 'movie');
    navigate(`/details/${type}/${item.id || item.mediaId}`);
  };

  const imageUrl = item.backdrop_path || item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`
    : item.thumbnail || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop";

  return (
    <div 
        onClick={handleNavigate}
        className="relative group cursor-pointer transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-lg aspect-[16/10] mb-2 lg:mb-3">
        <img 
          src={imageUrl} 
          alt={item.title || item.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
        />
        {isSeen && (
          <div className="absolute top-4 left-4 bg-green-500/80 backdrop-blur-sm rounded-full p-1 z-10">
            <CheckCircle className="w-5 h-5 text-white fill-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/25 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 hover:bg-white/40 transition-all">
                <div className="bg-white rounded-full p-2"><Play className="w-5 h-5 text-dark fill-dark" /></div>
                <span className="font-semibold text-lg">Play</span>
            </div>
        </div>
        <button 
            onClick={handleBookmark}
            className="absolute top-4 right-4 bg-dark/60 hover:bg-white transition-all p-2 rounded-full group/btn z-10"
        >
          <Bookmark className={`w-4 h-4 lg:w-5 lg:h-5 ${isBookmarked ? 'fill-white text-white' : 'text-white group-hover/btn:text-dark'} `} />
        </button>
        {isBookmarked && (
          <button 
              onClick={handleMarkAsSeen}
              className="absolute top-14 right-4 bg-dark/60 hover:bg-white transition-all p-2 rounded-full group/btn z-10"
              title={isSeen ? 'Mark as unwatched' : 'Mark as watched'}
          >
            <CheckCircle className={`w-4 h-4 lg:w-5 lg:h-5 ${isSeen ? 'fill-white text-white' : 'text-white group-hover/btn:text-dark'} `} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-grey text-xs lg:text-sm mb-1 opacity-75">
        <span>{(item.release_date || item.first_air_date || '').split('-')[0] || item.year}</span>
        <span className="w-1 h-1 bg-grey rounded-full"></span>
        <div className="flex items-center gap-1.5">
          {item.media_type === 'tv' || item.first_air_date || item.mediaType === 'tv' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
          <span>{item.media_type === 'tv' || item.first_air_date || item.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
        </div>
        <span className="w-1 h-1 bg-grey rounded-full"></span>
        <span>{item.adult ? '18+' : 'PG'}</span>
      </div>
      <h3 className="font-semibold text-base lg:text-xl truncate">{item.title || item.name}</h3>
    </div>
  );
};

export default MovieCard;
