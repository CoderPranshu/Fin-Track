import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-lg glass-card p-10 animate-fade-in shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2">Join FinTrack</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Start your financial journey today</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-radius text-center mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                className="input-field pl-12"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="name@example.com" 
                className="input-field pl-12"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                className="input-field pl-12"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-4 mt-4"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-primary font-black hover:underline ml-1">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
