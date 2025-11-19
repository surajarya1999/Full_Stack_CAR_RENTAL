import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-car-gamma.vercel.app/api',
    withCredentials: true, // for cookies
});

export default API;
