import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Upload from './pages/Upload';
import Users from './pages/Users';
import VideoView from './pages/VideoView';
import QuizView from './pages/QuizView';
import Bookmarks from './pages/Bookmarks';
import Progress from './pages/Progress';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<Materials />} />
            <Route path="upload" element={<ProtectedRoute adminOnly><Upload /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
            <Route path="video/:id" element={<VideoView />} />
            <Route path="quiz/:id" element={<QuizView />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="progress" element={<Progress />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
