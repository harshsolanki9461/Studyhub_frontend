import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Home, Upload, Users, BarChart, Bookmark, PlaySquare, FileText, Menu, LogOut, LayoutDashboard, Search, Award, Bell, Settings } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const adminPages = [
    { section: 'DASHBOARD', items: [
      { id: '', icon: <LayoutDashboard size={18} />, label: 'Home' },
    ]},
    { section: 'MANAGEMENT', items: [
      { id: 'materials', icon: <BookOpen size={18} />, label: 'All Materials' },
      { id: 'upload', icon: <Upload size={18} />, label: 'Upload Content' },
      { id: 'users', icon: <Users size={18} />, label: 'Users' },
    ]}
  ];

  const userPages = [
    { section: 'LEARNING', items: [
      { id: '', icon: <Home size={18} />, label: 'Home' },
      { id: 'materials', icon: <BookOpen size={18} />, label: 'Study Materials' },
      { id: 'bookmarks', icon: <Bookmark size={18} />, label: 'Bookmarks' },
      { id: 'progress', icon: <BarChart size={18} />, label: 'My Progress' },
    ]},
  ];

  const sections = isAdmin ? adminPages : userPages;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname.split('/')[1] || '';

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon" style={{background: 'none', color: 'var(--accent)', fontSize: '24px'}}>🏗️</div>
            <div>
              <div className="sidebar-logo-text" style={{color: 'var(--accent)', fontSize: '22px'}}>StudyHub</div>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              {section.section && <div className="nav-section-label">{section.section}</div>}
              {section.items.map((p) => (
                <div
                  key={p.id}
                  className={`nav-item ${currentPath === p.id ? 'active' : ''}`}
                  onClick={() => { navigate(`/${p.id}`); setSidebarOpen(false); }}
                  style={{
                    color: currentPath === p.id ? 'var(--accent)' : 'var(--text2)',
                    background: currentPath === p.id ? 'rgba(255, 122, 0, 0.1)' : 'transparent',
                    border: 'none',
                    fontWeight: currentPath === p.id ? '600' : '400'
                  }}
                >
                  <span className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>{p.icon}</span>
                  {p.label}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="nav-item">
            <span className="nav-icon"><Users size={18} /></span>
            Edit Profile
          </div>
          <div className="nav-item" onClick={handleLogout} style={{color: '#ff4d4f'}}>
            <span className="nav-icon"><LogOut size={18} /></span>
            Log Out
          </div>
        </div>
      </div>

      <div className="main-content" style={{padding: '0'}}>
        <div className="top-bar" style={{
          height: '64px',
          background: '#fff',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: '0',
          zIndex: '90'
        }}>
          <div className="search-box">
             <div className="hamburger" onClick={() => setSidebarOpen(true)} style={{ position: 'static', display: 'none' }}>
                <Menu size={20} />
             </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <button style={{background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', position: 'relative'}}>
               <Bell size={20} />
               <span style={{position:'absolute', top:'-2px', right:'-2px', width:'8px', height:'8px', background:'var(--danger)', borderRadius:'50%', border:'2px solid #fff'}}></span>
            </button>
            <div className="user-avatar" style={{width: '32px', height: '32px', fontSize: '12px', background: 'var(--accent)', color: '#fff'}}>
               {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{fontSize: '14px', fontWeight: '500'}}>{user?.name}</div>
          </div>
        </div>
        <div style={{padding: '28px', flex: 1}}>
          <Outlet />
        </div>
        
        <footer className="app-footer" style={{marginTop: '60px'}}>
           <div className="footer-grid">
              <div>
                 <div className="footer-logo">StudyHub</div>
                 <p className="footer-desc">The most comprehensive learning platform for Computer Science students. Master your subjects with curated materials and personalized tracking.</p>
              </div>
              <div>
                 <h4 className="footer-title">Platform</h4>
                 <Link to="/materials" className="footer-link">Materials</Link>
                 <Link to="/progress" className="footer-link">Analytics</Link>
                 <Link to="/bookmarks" className="footer-link">Bookmarks</Link>
              </div>
              <div>
                 <h4 className="footer-title">Support</h4>
                 <Link to="/" className="footer-link">Help Center</Link>
                 <Link to="/" className="footer-link">Terms of Service</Link>
                 <Link to="/" className="footer-link">Privacy Policy</Link>
              </div>
           </div>
           <div className="footer-bottom">
              © 2026 StudyHub Platform. Built for Excellence.
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
