import axios from 'axios';
import store from '@/store';
import { serverUrl } from '@/siteConfig';

axios.defaults.baseURL = serverUrl;
axios.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + store.state.connection.signature;

  return config;
});
