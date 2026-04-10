import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [tab, setTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (tab === 'register') {
        await register(name, email, password, 'user');
        // Auto-login after registration
        await login(email, password);
        navigate('/');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card section">
        <div className="login-logo">
          <div className="logo-icon">📚</div>
          <div>
            <div className="logo-text">StudyHub</div>
            <div style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '2px' }}>Your Learning Platform</div>
          </div>
        </div>

        <div className="login-tabs">
          <div className={`login-tab ${tab === 'user' ? 'active' : ''}`} onClick={() => setTab('user')}>Login</div>
          <div className={`login-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</div>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
            {tab === 'register' ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
