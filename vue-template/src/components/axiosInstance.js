import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://erp-test-v2.fr.eurofiber.com/api'
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('authenticated');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

export default instance;