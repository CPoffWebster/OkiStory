import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const apiKey = process.env.NEXT_PUBLIC_API_URL || '';
        config.headers['x-api-key'] = apiKey;
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default axiosInstance;
