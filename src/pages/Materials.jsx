import React, { useState, useEffect, useContext } from 'react';
import api, { backendURL } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Download, Trash2, Edit, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

// Removed static subjects array

const Materials = () => {
  const { user, toggleBookmark } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/materials');
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (m) => {
    try {
      await api.post(`/materials/view/${m._id}`);
      const finalUrl = m.url.startsWith('http') ? m.url : `${backendURL}${m.url}`;
      window.open(finalUrl, '_blank');
      fetchMaterials();
    } catch (err) {}
  };

  const filtered = materials.filter(m => {
    const matchSub = filter === 'All' || m.subject === filter;
    const matchQ = !search || m.title.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchQ;
  });

  return (
    <div className="section">
      <div className="page-header">
        <div className="page-title">📚 {isAdmin ? 'Manage Materials' : 'Study Materials'}</div>
        <div className="page-subtitle">{filtered.length} materials available</div>
      </div>

      <div className="search-bar">
        <span className="search-icon"><Search size={18} /></span>
        <input 
          className="search-input" 
          placeholder="Search materials..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <div className="card" style={{padding: '0', border: 'none', background: 'transparent'}}>
        <div style={{
          display: 'flex', 
          gap: '24px', 
          borderBottom: '1px solid var(--border)', 
          paddingBottom: '0', 
          marginBottom: '28px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {['All', ...new Set(materials.map(m => m.subject))].map(s => (
            <div 
              key={s} 
              style={{
                padding: '12px 4px',
                fontSize: '14px',
                fontWeight: filter === s ? '600' : '400',
                color: filter === s ? 'var(--accent)' : 'var(--text2)',
                cursor: 'pointer',
                borderBottom: filter === s ? '2px solid var(--accent)' : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: '0.2s'
              }}
              onClick={() => setFilter(s)}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="material-grid">
        {filtered.length === 0 && <div className="empty-state">No materials found</div>}
        {filtered.map(m => (
          <div key={m._id} className="material-card" style={{
            background: '#fff',
            padding: '24px',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            transition: '0.2s'
          }}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  background: m.type === 'pdf' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 122, 0, 0.1)',
                  color: m.type === 'pdf' ? '#ef4444' : 'var(--accent)',
                  textTransform: 'uppercase'
                }}>
                  {m.subject}
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  {!isAdmin && (
                    <button 
                      className={`bookmark-btn ${user?.bookmarks?.includes(m._id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(m._id);
                      }}
                      style={{background: 'none', border: 'none', cursor: 'pointer', color: user?.bookmarks?.includes(m._id) ? 'var(--accent)' : 'var(--text3)'}}
                    >
                      <Bookmark size={20} fill={user?.bookmarks?.includes(m._id) ? 'var(--accent)' : 'none'} />
                    </button>
                  )}
                  {isAdmin && (
                     <button onClick={() => handleDelete(m._id)} style={{background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', opacity: '0.6'}}>
                        <Trash2 size={16} />
                     </button>
                  )}
                </div>
             </div>
             
             <div className="material-title" style={{fontSize: '17px', fontWeight: '700', marginBottom: '0'}}>{m.title}</div>
             <p style={{fontSize: '13px', color: 'var(--text2)', lineHeight: '1.5', height: '40px', overflow: 'hidden'}}>{m.desc}</p>
             
             <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text3)', marginTop: '4px'}}>
                <span>🎓 Recently added for {m.subject}</span>
             </div>

             <div className="material-actions" style={{ marginTop: '12px' }}>
                {m.type === 'pdf' && !isAdmin && (
                  <button className="btn btn-accent btn-sm" onClick={() => handleDownload(m)} style={{width: '100%', padding: '10px'}}>
                    Download PDF
                  </button>
                )}
                {m.type === 'video' && !isAdmin && (
                  <Link to={`/video/${m._id}`} className="btn btn-accent btn-sm" style={{width: '100%', padding: '10px', textAlign: 'center'}}>▶ Watch Lecture</Link>
                )}
                {m.type === 'mcq' && !isAdmin && (
                  <Link to={`/quiz/${m._id}`} className="btn btn-accent btn-sm" style={{width: '100%', padding: '10px', textAlign: 'center'}}>📝 Attempt Test</Link>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
