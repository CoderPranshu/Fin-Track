import React, { useState, useEffect, useCallback, useContext } from 'react';
import { transactionService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const Transactions = () => {
  const { isReadOnly, isAdmin } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, type: '', search: '', category: '' });
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ amount: '', type: 'EXPENSE', category: '', date: format(new Date(), 'yyyy-MM-dd') });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transactionService.getAll(filters);
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await transactionService.getCategories();
      setCategories(res.data);
    };
    fetchCats();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    try {
      if (editingId) {
        await transactionService.update(editingId, formData);
      } else {
        await transactionService.create(formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ amount: '', type: 'EXPENSE', category: '', date: format(new Date(), 'yyyy-MM-dd') });
      fetchTransactions();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (isReadOnly || !window.confirm('Are you sure?')) return;
    try {
      await transactionService.delete(id);
      fetchTransactions();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: format(new Date(t.date), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search category..."
            className="w-full bg-white border border-slate-200 dark:border-white/10 rounded-radius py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:shadow-md transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            className="bg-white border border-slate-200 dark:border-white/10 rounded-radius px-4 py-3 focus:outline-none focus:border-primary focus:shadow-md transition-all cursor-pointer text-slate-900 dark:text-white font-medium"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          {!isReadOnly && (
            <button
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-radius font-semibold transition-all shadow-lg shadow-primary/20"
              onClick={() => { setShowModal(true); setEditingId(null); }}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Date</th>
                {isAdmin && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">User</th>}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">
                  {!isReadOnly && 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No transactions found</td></tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border-b border-slate-100 dark:border-white/5 last:border-0">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:opacity-70">{format(new Date(t.date), 'MMM dd, yyyy')}</td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{t.user?.name || 'Unknown'}</span>
                          <span className="text-[10px] text-slate-500 font-medium uppercase">{t.user?.email}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{t.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-base font-bold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                      {t.type === 'EXPENSE' ? '-' : '+'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isReadOnly && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(t)}
                            className="p-2 text-slate-500 hover:text-primary transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-6 py-4">
        <button
          className="p-2 rounded-full glass-card hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-400">
          Page <span className="text-white">{pagination.page}</span> of <span className="text-white">{pagination.totalPages}</span>
        </span>
        <button
          className="p-2 rounded-full glass-card hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          disabled={filters.page === pagination.totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md glass-card p-10 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">{editingId ? 'Edit Entry' : 'New Entry'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-radius py-3 px-4 focus:outline-none focus:border-primary transition-all"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Type</label>
                <select
                  name="type"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-radius py-3 px-4 focus:outline-none focus:border-primary transition-all cursor-pointer"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Category</label>
                <input
                  type="text"
                  name="category"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-radius py-3 px-4 focus:outline-none focus:border-primary transition-all"
                  value={formData.category}
                  onChange={handleInputChange}
                  list="cat-list"
                  required
                />
                <datalist id="cat-list">
                  {categories.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-radius py-3 px-4 focus:outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-radius transition-all shadow-lg shadow-primary/20"
                >
                  {editingId ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
