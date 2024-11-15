import axios from 'axios';

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ENDPOINT || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customFetch;
