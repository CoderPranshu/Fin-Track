import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, ReceiptText, LogOut, User as UserIcon, Users } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Users', path: '/admin/users', icon: <Users size={20} /> });
  }

  return (
    <div className="flex min-h-screen pt-24 px-6 gap-6 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 fixed left-6 top-24 bottom-6 hidden lg:flex flex-col glass-card p-6 shadow-lg">
        <div className="space-y-2 flex-1">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-4 p-4 rounded-radius transition-all font-semibold ${
                location.pathname === item.path 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
              <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold truncate text-sm">{user?.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 p-4 rounded-radius text-rose-500 hover:bg-rose-500/5 transition-colors font-semibold text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col gap-6 mb-6">
        <header className="glass-card p-6 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold tracking-tight">
            {navItems.find(i => i.path === location.pathname)?.name || 'Welcome'}
          </h1>
          <div className="flex items-center gap-4">
            {user?.role === 'ADMIN' && (
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                Admin
              </span>
            )}
          </div>
        </header>

        <div className="animate-fade-in flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
