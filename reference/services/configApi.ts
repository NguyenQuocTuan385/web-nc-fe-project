import { EKey } from './../models/general';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { routes } from 'routers/routes';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
});

api.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang');
    const token = localStorage.getItem(EKey.TOKEN) ?? localStorage.getItem(EKey.TOKEN_GUEST);
    if (token) config.headers.common['Authorization'] = `Bearer ${token}`;
    if (lang) config.headers.common['lang'] = lang;
    return config;
  }
);

api.interceptors.response.use((response) => {
  return response;
 }, (error) => {
  if(error.response.status === 401){
    localStorage.removeItem(EKey.TOKEN);
    localStorage.removeItem(EKey.TOKEN_GUEST);
    const dispatch = useDispatch()
    dispatch(push(routes.login))
    return Promise.reject(error);
  }
  return Promise.reject(error);
 });

export default api;

