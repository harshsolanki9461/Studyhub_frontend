import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trophy, Target, Clock, BookOpen } from 'lucide-react';

const Progress = () => {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/materials');
        setMaterials(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const prog = user?.progress || {};
  const data = Object.keys(prog).map(subject => ({
    name: subject,
    progress: prog[subject] || 0
  })).filter(d => d.progress > 0);

  if (loading) return <div className="section shimmer" style={{height: '400px', borderRadius: '12px'}}></div>;

  const COLORS = ['#ff7a00', '#6c63ff', '#10b981', '#ef4444', '#ffb300', '#8b5cf6'];

  return (
    <div className="section" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <div className="page-header">
        <div className="page-title">📊 Analytics & Progress</div>
        <div className="page-subtitle">Detailed breakdown of your learning journey.</div>
      </div>

      <div className="stats-grid">
         <div className="stat-card">
            <div className="stat-card-icon"><Trophy size={24} color="var(--accent)" /></div>
            <div className="stat-card-value">{Math.round(Object.values(prog).reduce((a, b) => a + b, 0) / (Object.keys(prog).length || 1))}%</div>
            <div className="stat-card-label">Overall Mastery</div>
         </div>
         <div className="stat-card">
            <div className="stat-card-icon"><BookOpen size={24} color="var(--success)" /></div>
            <div className="stat-card-value">{Object.keys(prog).length}</div>
            <div className="stat-card-label">Subjects Started</div>
         </div>
         <div className="stat-card">
            <div className="stat-card-icon"><Target size={24} color="var(--accent)" /></div>
            <div className="stat-card-value">{materials.length}</div>
            <div className="stat-card-label">Total Materials</div>
         </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px'}}>
         <div className="card">
            <div className="card-header">
               <span className="card-title">Subject Wise Completion</span>
               <span style={{fontSize: '12px', color: 'var(--text3)'}}>Weekly Trend</span>
            </div>
            <div style={{width: '100%', height: '300px', marginTop: '20px'}}>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.length > 0 ? data : [{name: 'Empty', progress: 0}]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text2)'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text2)'}} domain={[0, 100]} />
                     <Tooltip 
                        contentStyle={{background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                        cursor={{fill: 'rgba(255,122,0,0.05)'}}
                     />
                     <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card">
            <div className="card-header">
               <span className="card-title">Activity Status</span>
            </div>
            <div style={{textAlign: 'center', padding: '20px 0'}}>
               <div style={{fontSize: '60px', marginBottom: '16px'}}>⚡</div>
               <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>Keep it Up!</h3>
               <p style={{fontSize: '13px', color: 'var(--text2)', marginBottom: '24px'}}>You are in the top 15% of learners this week.</p>
               <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', background: 'var(--bg3)', borderRadius: '8px'}}>
                     <span style={{color: 'var(--text2)'}}>Quizzes Taken</span>
                     <span style={{fontWeight: '700'}}>12</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', background: 'var(--bg3)', borderRadius: '8px'}}>
                     <span style={{color: 'var(--text2)'}}>Videos Watched</span>
                     <span style={{fontWeight: '700'}}>8</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', background: 'var(--bg3)', borderRadius: '8px'}}>
                     <span style={{color: 'var(--text2)'}}>Notes Read</span>
                     <span style={{fontWeight: '700'}}>24</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Progress;
