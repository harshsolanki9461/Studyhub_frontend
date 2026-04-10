import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Bookmark, PlaySquare, FileText, LayoutDashboard } from 'lucide-react';

const Bookmarks = () => {
  const { user, toggleBookmark } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get('/materials');
        setMaterials(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const savedMats = materials.filter(m => user?.bookmarks?.includes(m._id));

  return (
    <div className="section">
      <div className="page-header">
        <div className="page-title">🔖 My Bookmarks</div>
        <div className="page-subtitle">Quickly access the materials you saved.</div>
      </div>

      {loading ? (
         <div className="shimmer" style={{height: '200px', borderRadius: '12px'}}></div>
      ) : savedMats.length > 0 ? (
        <div className="material-grid">
          {savedMats.map(m => (
            <div key={m._id} className="material-card">
              <span className={`material-type-badge badge-${m.type}`}>
                {m.type === 'pdf' ? <FileText size={12}/> : m.type === 'video' ? <PlaySquare size={12}/> : m.type === 'mcq' ? <LayoutDashboard size={12}/> : null}
                {m.type.toUpperCase()}
              </span>
              
              <button 
                className={`bookmark-btn ${user?.bookmarks?.includes(m._id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(m._id);
                }}
                style={{color: user?.bookmarks?.includes(m._id) ? 'var(--accent)' : 'var(--text3)'}}
              >
                <Bookmark size={20} fill={user?.bookmarks?.includes(m._id) ? 'var(--accent)' : 'none'} />
              </button>

              <h3 className="material-title">{m.title}</h3>
              <div className="material-subject">{m.subject}</div>
              
              <div className="material-meta">
                <span>👁️ {m.views || 0} views</span>
              </div>
              
              <div className="material-actions">
                {m.type === 'video' ? (
                  <Link to={`/video/${m._id}`} className="btn btn-sm btn-ghost" style={{width:'100%', textAlign:'center'}}>Watch</Link>
                ) : m.type === 'mcq' ? (
                  <Link to={`/quiz/${m._id}`} className="btn btn-sm btn-ghost" style={{width:'100%', textAlign:'center'}}>Take Quiz</Link>
                ) : (
                  <a href={`http://localhost:5000${m.url}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost" style={{width:'100%', textAlign:'center'}}>View PDF</a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state card">
            <div className="empty-icon">🔖</div>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: 'var(--text)'}}>No Bookmarks Yet</h3>
            <p style={{marginTop: '8px', fontSize: '13px'}}>Save materials to easily access them here.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
