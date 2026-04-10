import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
    };

    const register = async (name, email, password, role) => {
        await api.post('/auth/register', { name, email, password, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const toggleBookmark = async (materialId) => {
        try {
            const res = await api.post(`/auth/bookmark/${materialId}`);
            const updatedUser = { ...user, bookmarks: res.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Failed to toggle bookmark', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser, toggleBookmark }}>
            {children}
        </AuthContext.Provider>
    );
};
