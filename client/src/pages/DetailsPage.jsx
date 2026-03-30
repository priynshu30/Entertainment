import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, Calendar, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const DetailsPage = () => {
    const { type, id } = useParams();
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`);
                setItem(response.data);
            } catch (err) {
                console.error("Failed to fetch details", err);
            }
        };
        fetchDetails();
    }, [type, id]);

    if (!item) return <div className="p-10 text-xl flex items-center justify-center min-h-[50vh] animate-pulse">Loading detailed view...</div>;

    const imageUrl = `https://image.tmdb.org/t/p/original${item.poster_path || item.backdrop_path}`;

    return (
        <div className="p-4 lg:p-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-grey hover:text-white transition-colors mb-8 group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to browsing
            </button>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                <div className="w-full lg:w-1/3 max-w-sm self-center lg:self-start rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
                    <img src={imageUrl} alt={item.title || item.name} className="w-full h-auto object-cover" />
                </div>
                
                <div className="flex-1">
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{item.title || item.name}</h1>
                    {item.tagline && <p className="text-xl text-primary italic mb-8 opacity-90">"{item.tagline}"</p>}
                    
                    <div className="flex flex-wrap gap-3 mb-10">
                        {item.genres?.map(g => (
                            <span key={g.id} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                                {g.name}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="glass-card p-4 text-center">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 mx-auto mb-2" />
                            <p className="text-xl font-bold">{item.vote_average?.toFixed(1)}/10</p>
                            <p className="text-xs text-grey uppercase tracking-widest mt-1">TMDB Rating</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Clock className="w-6 h-6 text-grey mx-auto mb-2" />
                            <p className="text-xl font-bold">{item.runtime || item.episode_run_time?.[0] || 'N/A'} min</p>
                            <p className="text-xs text-grey uppercase tracking-widest mt-1">Duration</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Calendar className="w-6 h-6 text-grey mx-auto mb-2" />
                            <p className="text-xl font-bold">{(item.release_date || item.first_air_date || '').split('-')[0]}</p>
                            <p className="text-xs text-grey uppercase tracking-widest mt-1">Released</p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">Overview</h3>
                        <p className="text-grey leading-relaxed text-lg max-w-3xl">{item.overview}</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="btn-primary px-10 py-4 text-lg">
                            Watch Trailer
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-4 rounded-lg font-medium transition-all">
                            Add to Watchlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
