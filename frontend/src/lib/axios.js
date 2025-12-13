import axios from "axios";

// Backend base URL - change based on environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://theater-booking.local/backend";

export const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for debugging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('[API Response Error]', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.error || error.message
        });
        return Promise.reject(error);
    }
);