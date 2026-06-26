import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Users, CheckCircle, Award, LogOut, Plus, Trash2, Edit } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, loading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [interns, setInterns] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, active: 0, completed: 0 });
  const [isFetching, setIsFetching] = useState(false);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, intern_id: '', certificate_number: '', full_name: '', domain: '', batch: '', status: 'Active' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [resInterns, resStats] = await Promise.all([
        api.get('/admin/interns'),
        api.get('/admin/analytics')
      ]);
      if (resInterns.data.success) setInterns(resInterns.data.data);
      if (resStats.data.success) setAnalytics(resStats.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(email, password);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this intern?')) return;
    try {
      await api.delete(\`/admin/interns/\${id}\`);
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (intern) => {
    setFormData(intern);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(\`/admin/interns/\${formData.id}\`, formData);
      } else {
        await api.post('/admin/interns', formData);
      }
      setShowForm(false);
      setFormData({ id: null, intern_id: '', certificate_number: '', full_name: '', domain: '', batch: '', status: 'Active' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen relative p-4">
        <div className="bg-blob blob-1"></div>
        <div className="glass-panel w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" className="glass-input" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="glass-input" value={password} onChange={e => setPassword(e.target.value)} required />
            {loginError && <p className="text-[var(--error)] text-sm">{loginError}</p>}
            <button type="submit" className="glass-button mt-2">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative">
      <div className="bg-blob blob-2" style={{ top: 0, right: 0, bottom: 'auto' }}></div>
      
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 glass-panel p-4" style={{ borderRadius: '16px' }}>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Award className="text-[var(--primary)]" /> Dremora Admin</h1>
          <button onClick={logout} className="flex items-center gap-2 text-[var(--error)] hover:text-red-400 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 flex items-center gap-4">
            <div className="p-4 bg-[var(--primary)]/20 rounded-full text-[var(--primary)]"><Users size={28} /></div>
            <div><p className="text-[var(--text-muted)]">Total Interns</p><h3 className="text-3xl font-bold">{analytics.total}</h3></div>
          </div>
          <div className="glass-panel p-6 flex items-center gap-4">
            <div className="p-4 bg-[var(--success)]/20 rounded-full text-[var(--success)]"><CheckCircle size={28} /></div>
            <div><p className="text-[var(--text-muted)]">Active</p><h3 className="text-3xl font-bold">{analytics.active}</h3></div>
          </div>
          <div className="glass-panel p-6 flex items-center gap-4">
            <div className="p-4 bg-[var(--secondary)]/20 rounded-full text-[var(--secondary)]"><Award size={28} /></div>
            <div><p className="text-[var(--text-muted)]">Completed</p><h3 className="text-3xl font-bold">{analytics.completed}</h3></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Intern Records</h2>
            <button onClick={() => { setFormData({ id: null, intern_id: '', certificate_number: '', full_name: '', domain: '', batch: '', status: 'Active' }); setShowForm(true); }} className="glass-button flex items-center gap-2" style={{ width: 'auto', padding: '10px 16px' }}>
              <Plus size={18} /> Add Intern
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-black/20 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Intern ID" required className="glass-input" value={formData.intern_id} onChange={e => setFormData({...formData, intern_id: e.target.value})} />
              <input type="text" placeholder="Certificate Number" required className="glass-input" value={formData.certificate_number} onChange={e => setFormData({...formData, certificate_number: e.target.value})} />
              <input type="text" placeholder="Full Name" required className="glass-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              <input type="text" placeholder="Domain" required className="glass-input" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} />
              <input type="text" placeholder="Batch" required className="glass-input" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} />
              <select className="glass-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Active" style={{color:'black'}}>Active</option>
                <option value="Completed" style={{color:'black'}}>Completed</option>
              </select>
              <div className="col-span-1 md:col-span-2 flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="glass-button" style={{ width: 'auto', padding: '8px 24px' }}>Save</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                ) : interns.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No records found.</td></tr>
                ) : (
                  interns.map(intern => (
                    <tr key={intern.id} className="hover:bg-white/5 transition-colors">
                      <td className="font-mono text-sm">{intern.intern_id}</td>
                      <td className="font-semibold">{intern.full_name}</td>
                      <td>{intern.domain}</td>
                      <td>
                        <span className={\`px-2 py-1 rounded text-xs \${intern.status === 'Active' ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--secondary)]/20 text-[var(--secondary)]'}\`}>
                          {intern.status}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button onClick={() => handleEdit(intern)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40 transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(intern.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
