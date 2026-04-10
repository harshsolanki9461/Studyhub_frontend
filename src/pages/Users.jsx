import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Mail, Clock, Shield, User as UserIcon } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/auth/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="section shimmer" style={{height: '400px', borderRadius: '12px'}}></div>;

    return (
        <div className="section">
            <div className="page-header">
                <div className="page-title">👥 User Management</div>
                <div className="page-subtitle">Manage system users and monitor their activities.</div>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Registered Users ({users.length})</span>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Last Active</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            <div className="user-avatar" style={{width:'32px', height:'32px', fontSize:'12px', background: 'var(--bg4)', color: 'var(--text)'}}>
                                                {u.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <span style={{fontWeight: '600'}}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)'}}>
                                            <Mail size={14} /> {u.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px', 
                                            borderRadius: '6px', 
                                            fontSize: '11px', 
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            background: u.role === 'admin' ? 'rgba(255, 122, 0, 0.1)' : 'rgba(108, 99, 255, 0.1)',
                                            color: u.role === 'admin' ? 'var(--accent)' : '#6c63ff'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{color: 'var(--text3)', fontSize: '12px'}}>
                                        {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td style={{width: '150px'}}>
                                        <div className="progress-bar-bg" style={{height: '6px'}}>
                                            <div className="progress-bar-fill" style={{
                                                width: `${Math.round(Object.values(u.progress || {}).reduce((a, b) => a + b, 0) / (Object.keys(u.progress || {}).length || 1))}%`,
                                                background: 'var(--success)'
                                            }} />
                                        </div>
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

export default Users;
