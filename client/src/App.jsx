import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVSeriesPage from './pages/TVSeriesPage';
import BookmarksPage from './pages/BookmarksPage';
import DetailsPage from './pages/DetailsPage';
import Navbar from './components/Navbar';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="flex bg-[#10141E] min-h-screen text-white flex-col lg:flex-row overflow-hidden">
        {token && <Navbar />}
        <main className="flex-1 p-6 lg:p-10 lg:pl-0 overflow-y-auto max-h-screen no-scrollbar">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/movies" element={token ? <MoviesPage /> : <Navigate to="/login" />} />
            <Route path="/tv" element={token ? <TVSeriesPage /> : <Navigate to="/login" />} />
            <Route path="/bookmarks" element={token ? <BookmarksPage /> : <Navigate to="/login" />} />
            <Route path="/details/:type/:id" element={token ? <DetailsPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
