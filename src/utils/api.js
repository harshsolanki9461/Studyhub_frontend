import axios from 'axios';

const userUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = userUrl.endsWith('/api') ? userUrl : `${userUrl.replace(/\/$/, '')}/api`;

export const backendURL = userUrl.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
