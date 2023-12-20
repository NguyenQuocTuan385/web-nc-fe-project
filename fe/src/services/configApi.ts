import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
