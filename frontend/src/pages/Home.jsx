import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
          Manage Your Money with <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Unrivaled Clarity
          </span>
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-12 font-medium opacity-80">
          The all-in-one financial dashboard designed for modern users. 
          Track every penny, visualize trends, and reach your goals faster.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-24">
          <Link
            to="/register"
            className="btn-primary px-10 py-4 text-lg"
          >
            Start Free Today
          </Link>
          <Link 
            to="/login" 
            className="bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 px-10 py-4 rounded-radius font-semibold text-lg transition-all border border-slate-300 dark:border-white/10 hover:-translate-y-0.5"
          >
            Watch Demo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 text-left hover:border-primary/40 transition-all group hover:shadow-2xl hover:shadow-primary/5">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-sm">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Precision Analytics</h3>
            <p className="leading-relaxed font-medium opacity-70">
              Turn your spending habits into clear, actionable insights with our premium charting engine.
            </p>
          </div>

          <div className="glass-card p-10 text-left hover:border-accent/40 transition-all group hover:shadow-2xl hover:shadow-accent/5">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform shadow-sm">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Secure by Design</h3>
            <p className="text-slate-800 dark:text-slate-400 leading-relaxed font-medium">
              We use military-grade encryption to ensure your financial data stays yours and only yours.
            </p>
          </div>

          <div className="glass-card p-10 text-left hover:border-secondary/40 transition-all group hover:shadow-2xl hover:shadow-secondary/5">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform shadow-sm">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Lightning Fast</h3>
            <p className="text-slate-800 dark:text-slate-400 leading-relaxed font-medium">
              Optimized for speed with custom caching, so you can track transactions on the go without lag.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
