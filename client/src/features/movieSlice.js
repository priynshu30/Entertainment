import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const SERVER_URL = import.meta.env.VITE_API_URL + '/api/bookmarks';

// Debug logging
console.log('🔑 TMDB API Key Status:', TMDB_API_KEY && TMDB_API_KEY !== 'your_actual_tmdb_api_key' ? '✅ SET' : '❌ NOT SET or PLACEHOLDER');
console.log('📡 TMDB Base URL:', TMDB_BASE_URL);
console.log('🖥️ Server URL:', SERVER_URL);

const initialState = {
  trending: [],
  movies: [],
  tvSeries: [],
  bookmarks: [],
  searchResults: [],
  status: 'idle',
  error: null,
};

export const fetchTrending = createAsyncThunk('movie/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your_actual_tmdb_api_key') {
      throw new Error('TMDB API Key is not configured. Please set VITE_TMDB_API_KEY in client/.env');
    }
    const url = `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`;
    console.log('📡 Fetching trending from:', url);
    const response = await axios.get(url);
    console.log('✅ Trending data loaded:', response.data.results.length, 'items');
    return response.data.results;
  } catch (err) {
    console.error('❌ fetchTrending Error:', err.message);
    return rejectWithValue(err.message);
  }
});

export const fetchMovies = createAsyncThunk('movie/fetchMovies', async (_, { rejectWithValue }) => {
    try {
        if (!TMDB_API_KEY || TMDB_API_KEY === 'your_actual_tmdb_api_key') {
            throw new Error('TMDB API Key is not configured. Please set VITE_TMDB_API_KEY in client/.env');
        }
        const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`;
        console.log('📡 Fetching movies from:', url);
        const response = await axios.get(url);
        console.log('✅ Movies data loaded:', response.data.results.length, 'items');
        return response.data.results;
    } catch (err) {
        console.error('❌ fetchMovies Error:', err.message);
        return rejectWithValue(err.message);
    }
});

export const fetchTVSeries = createAsyncThunk('movie/fetchTVSeries', async (_, { rejectWithValue }) => {
    try {
        if (!TMDB_API_KEY || TMDB_API_KEY === 'your_actual_tmdb_api_key') {
            throw new Error('TMDB API Key is not configured. Please set VITE_TMDB_API_KEY in client/.env');
        }
        const url = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}`;
        console.log('📡 Fetching TV series from:', url);
        const response = await axios.get(url);
        console.log('✅ TV series data loaded:', response.data.results.length, 'items');
        return response.data.results;
    } catch (err) {
        console.error('❌ fetchTVSeries Error:', err.message);
        return rejectWithValue(err.message);
    }
});

export const fetchBookmarks = createAsyncThunk('movie/fetchBookmarks', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        if (!auth.token) {
            return rejectWithValue({ message: 'No authentication token' });
        }
        const response = await axios.get(SERVER_URL, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error('fetchBookmarks error:', err);
        return rejectWithValue(err.response?.data || { message: 'Failed to fetch bookmarks' });
    }
});

export const toggleBookmark = createAsyncThunk('movie/toggleBookmark', async (mediaData, { getState, rejectWithValue }) => {
    try {
        const { auth, movie } = getState();
        if (!auth.token) {
            return rejectWithValue({ message: 'No authentication token' });
        }
        const existing = movie.bookmarks.find(b => b.mediaId === String(mediaData.mediaId));
        if (existing && existing.isBookmarked) {
            await axios.delete(`${SERVER_URL}/${mediaData.mediaId}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            return { mediaId: mediaData.mediaId, action: 'remove' };
        } else {
            const response = await axios.post(SERVER_URL, mediaData, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            return { bookmark: response.data, action: 'add' };
        }
    } catch (err) {
        console.error('toggleBookmark error:', err);
        return rejectWithValue(err.response?.data || { message: 'Failed to toggle bookmark' });
    }
});

export const markMovieAsSeen = createAsyncThunk('movie/markMovieAsSeen', async ({ mediaId, isSeen }, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        if (!auth.token) {
            return rejectWithValue({ message: 'No authentication token' });
        }
        const response = await axios.patch(`${SERVER_URL}/${mediaId}/seen`, { isSeen }, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        return { ...response.data, mediaId };
    } catch (err) {
        console.error('markMovieAsSeen error:', err);
        return rejectWithValue(err.response?.data || { message: 'Failed to mark as seen' });
    }
});

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Failed to fetch trending';
      })
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Failed to fetch movies';
      })
      .addCase(fetchTVSeries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTVSeries.fulfilled, (state, action) => {
        state.tvSeries = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchTVSeries.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Failed to fetch TV series';
      })
      .addCase(fetchBookmarks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = Array.isArray(action.payload) ? action.payload : [];
        state.status = 'idle';
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload?.message || 'Failed to fetch bookmarks';
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        if (action.payload.action === 'add') {
            state.bookmarks.push(action.payload.bookmark);
        } else {
            state.bookmarks = state.bookmarks.filter(b => b.mediaId !== String(action.payload.mediaId));
        }
      })
      .addCase(toggleBookmark.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to toggle bookmark';
      })
      .addCase(markMovieAsSeen.fulfilled, (state, action) => {
        const mediaId = action.payload?.mediaId || action.payload?._id;
        const index = state.bookmarks.findIndex(b => b.mediaId === String(mediaId));
        if (index !== -1) {
            state.bookmarks[index].isSeen = action.payload.isSeen;
            state.bookmarks[index].seenAt = action.payload.seenAt;
        }
      })
      .addCase(markMovieAsSeen.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to mark as seen';
      });
  },
});

export default movieSlice.reducer;
