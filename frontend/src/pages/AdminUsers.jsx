import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Users, Shield, Trash2, UserCog, Mail } from 'lucide-react';
import { format } from 'date-fns';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.delete(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="p-10 text-center opacity-50">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">User Management</h2>
            <p className="text-sm opacity-60">Manage roles and permissions for all users</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold opacity-50 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-xs font-semibold opacity-50 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold opacity-50 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-semibold opacity-50 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-xs opacity-50 flex items-center gap-1">
                          <Mail size={12} /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm opacity-60">
                    {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary/50 cursor-pointer"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="READ_ONLY">Read-Only</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
