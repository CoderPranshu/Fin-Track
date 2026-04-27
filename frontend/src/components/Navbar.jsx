import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 border-white/10">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          FinTrack
        </Link>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
          </button>

          {user ? (
            <Link 
              to="/dashboard" 
              className="btn-primary flex items-center gap-2"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
