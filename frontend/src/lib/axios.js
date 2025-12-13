import axios from "axios";

// Визначаємо базовий URL залежно від середовища
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // ВАЖЛИВО для сесій та cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 секунд timeout
});

// Interceptor для логування запитів (тільки в development)
if (import.meta.env.DEV) {
    axiosInstance.interceptors.request.use(
        (config) => {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        },
        (error) => {
            console.error('[API Request Error]', error);
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
            return response;
        },
        (error) => {
            console.error('[API Response Error]', error.response?.data || error.message);
            return Promise.reject(error);
        }
    );
}