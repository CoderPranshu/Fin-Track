import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md glass-card p-10 animate-fade-in shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-radius text-center mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="input-field pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••" 
                className="input-field pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            New here? <Link to="/register" className="text-primary font-black hover:underline ml-1">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
