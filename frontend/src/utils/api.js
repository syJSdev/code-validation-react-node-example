import axios from 'axios';

export const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const checkCode = (code) => baseAPI.post('/validate', { code });
