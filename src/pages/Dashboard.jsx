import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Users, BookOpen, Eye, Award, Clock, Star, TrendingUp, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/materials');
        setMaterials(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    const totalViews = materials.reduce((a, m) => a + m.views, 0);
    return (
      <div className="section">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-title">📊 Admin Dashboard</div>
            <div className="page-subtitle">Welcome back, {user?.name}! Here's what's happening today.</div>
          </div>
          <Link to="/upload" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⬆️</span> Upload Content
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon"><BookOpen size={28} color="var(--accent)" /></div>
            <div className="stat-card-value">{materials.length}</div>
            <div className="stat-card-label">Study Materials</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon"><Eye size={28} color="var(--success)" /></div>
            <div className="stat-card-value">{totalViews}</div>
            <div className="stat-card-label">Total Views</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🔥 Most Viewed Materials</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {materials.sort((a,b) => b.views - a.views).slice(0, 5).map(m => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.subject}</td>
                  <td>{m.type.toUpperCase()}</td>
                  <td>👁️ {m.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // User Dashboard
  const recentMats = materials.slice(0, 4);
  const prog = user?.progress || { DSA: 0, DBMS: 0, CN: 0, OS: 0 };
  const overall = Math.round(Object.values(prog).reduce((a, b) => a + b, 0) / (Object.keys(prog).length || 1));

  // User Dashboard
  return (
    <div className="section" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <div className="hero-section" style={{textAlign: 'center', padding: '60px 20px'}}>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px',
          background: 'rgba(255, 122, 0, 0.05)',
          border: '1px solid rgba(255, 122, 0, 0.2)',
          borderRadius: '20px',
          color: 'var(--accent)',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '24px'
        }}>
          StudyHub: Your Ultimate Learning Partner
        </div>
        
        <h2 style={{fontSize: '24px', fontWeight: '500', marginBottom: '8px'}}>
          Master your <span style={{color: 'var(--accent)'}}>Computer Science</span> subjects
        </h2>
        <h1 style={{fontSize: '56px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px'}}>
          Crack Your <span style={{color: 'var(--accent)'}}>Exams</span> with StudyHub
        </h1>
        
        <p style={{
          maxWidth: '600px',
          margin: '0 auto 40px',
          color: 'var(--text2)',
          fontSize: '18px',
          lineHeight: '1.6'
        }}>
          Access carefully curated notes, video lectures, and interactive quizzes. 
          Everything you need to master DSA, DBMS, OS, and CN in one place.
        </p>
        
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
          <button className="btn btn-accent" style={{padding: '14px 40px', fontSize: '15px', borderRadius: '8px', background: 'var(--accent)', boxShadow: '0 4px 14px rgba(255, 122, 0, 0.3)'}} onClick={() => navigate('/materials')}>
            Get Started
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
         <button className="btn btn-ghost" onClick={() => navigate('/materials')} style={{padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', background: '#fff'}}>
            <BookOpen size={18} /> Browse Materials
         </button>
         <button className="btn btn-ghost" onClick={() => navigate('/progress')} style={{padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', background: '#fff'}}>
            <BarChart size={18} /> View Analytics
         </button>
      </div>

      <div className="card">
        <div className="card-header">
           <span className="card-title">🚀 Your Learning Roadmap</span>
           <span style={{fontSize: '12px', color: 'var(--accent)', fontWeight: '600'}}>85% Complete</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
           {[
             { title: 'Data Structures', icon: '🌳', color: '#6c63ff', key: 'DSA', desc: 'Master Trees & Graphs' },
             { title: 'Database Systems', icon: '🗄️', color: '#ffb300', key: 'DBMS', desc: 'SQL & Normalization' },
             { title: 'Operating Systems', icon: '⚙️', color: '#10b981', key: 'OS', desc: 'Memory Management' },
             { title: 'Computer Networks', icon: '🌐', color: '#ef4444', key: 'CN', desc: 'TCP/IP & Routing' }
           ].map((item, i) => (
             <div key={i} className="stat-card card-hover" style={{padding: '24px', borderLeft: `4px solid ${item.color}`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                   <div style={{fontSize: '32px'}}>{item.icon}</div>
                   <span style={{fontSize: '14px', fontWeight: '700', color: item.color}}>{prog[item.key] || 0}%</span>
                </div>
                <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '4px'}}>{item.title}</h3>
                <p style={{fontSize: '12px', color: 'var(--text2)', marginBottom: '16px'}}>{item.desc}</p>
                <div className="progress-bar-bg" style={{height: '6px'}}>
                  <div className="progress-bar-fill" style={{width: `${prog[item.key] || 0}%`, background: item.color}} />
                </div>
             </div>
           ))}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px'}}>
         <div className="card">
            <div className="card-header">
               <span className="card-title">🔥 Daily Trending Topics</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               {materials.length > 0 ? (
                 materials.sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 3).map((m, i) => (
                   <div 
                    key={i} 
                    className="card-hover"
                    style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '8px', background: 'var(--bg3)', cursor: 'pointer'}}
                    onClick={() => {
                       const path = m.type === 'video' ? `/video/${m._id}` : m.type === 'mcq' ? `/quiz/${m._id}` : m.url;
                       if (path) navigate(path);
                    }}
                   >
                      <div style={{width:'40px', height:'40px', background: 'var(--bg4)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                         <TrendingUp size={20} />
                      </div>
                      <div style={{flex:1}}>
                         <div style={{fontSize:'14px', fontWeight:'600'}}>{m.title}</div>
                         <div style={{fontSize:'12px', color:'var(--text2)'}}>{m.subject}</div>
                      </div>
                      <div style={{fontSize:'12px', fontWeight:'700', color:'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <Eye size={12} /> {m.views || 0}
                      </div>
                   </div>
                 ))
               ) : (
                 <div style={{textAlign: 'center', color: 'var(--text3)', padding: '20px', fontSize: '13px'}}>No trending topics yet</div>
               )}
            </div>
         </div>
         <div className="card" style={{background: 'linear-gradient(135deg, var(--accent), #ff9500)', color: '#fff', border: 'none'}}>
            <div style={{display:'flex', flexDirection:'column', height:'100%', justifyContent:'center', textAlign:'center', padding: '20px'}}>
               <div style={{fontSize: '40px', marginBottom: '16px'}}>👑</div>
               <h2 style={{fontSize: '20px', fontWeight: '800', marginBottom: '8px'}}>StudyHub Premium</h2>
               <p style={{fontSize: '13px', opacity: '0.9', marginBottom: '24px'}}>Get unlimited access to all expert-curated mock tests & videos.</p>
               <button className="btn" style={{background: '#fff', color: 'var(--accent)', border: 'none', padding: '12px'}}>Upgrade Now</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
