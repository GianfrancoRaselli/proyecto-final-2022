import axios from 'axios';
import store from '@/store';

axios.defaults.baseURL = 'http://localhost:4000/';
axios.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + store.state.connection.signature;

  return config;
});
