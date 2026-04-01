import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const publicRoutes = ['register/', 'login/'];
    const isPublic = publicRoutes.some(route => config.url.includes(route));
    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-redirect on expired/invalid token
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_email');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;