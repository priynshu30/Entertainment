import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { LayoutGrid, Film, Tv, Bookmark, LogOut, Film as FilmLogo } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { icon: <LayoutGrid />, path: '/', label: 'Home' },
    { icon: <Film />, path: '/movies', label: 'Movies' },
    { icon: <Tv />, path: '/tv', label: 'TV Series' },
    { icon: <Bookmark />, path: '/bookmarks', label: 'Bookmarks' },
  ];

  return (
    <nav className="fixed lg:relative bottom-0 left-0 w-full lg:w-24 bg-semi-dark p-4 lg:p-6 flex flex-row lg:flex-col items-center justify-between z-50 lg:rounded-2xl lg:m-6 lg:h-[calc(100vh-48px)]">
      <div className="hidden lg:block mb-10">
        <FilmLogo className="w-8 h-8 text-primary" />
      </div>
      
      <div className="flex flex-row lg:flex-col gap-8 lg:gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'text-white' : 'text-grey'} hover:text-primary transition-colors`
            }
          >
            {React.cloneElement(item.icon, { className: "w-6 h-6 lg:w-6 lg:h-6" })}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4 lg:flex-col lg:gap-6 mt-auto">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white overflow-hidden">
          <img 
            src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Guest'}`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <button onClick={handleLogout} className="text-grey hover:text-white transition-colors">
            <LogOut className="w-6 h-6 lg:w-6 lg:h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
