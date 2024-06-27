// src/utils/axiosConfig.js

import axios from 'axios';

// Crear una instancia de Axios
const instance = axios.create({
    baseURL: 'http://localhost:8000/api', // Base URL de tu API
});

// Configurar un interceptor para incluir el token en todas las solicitudes
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
