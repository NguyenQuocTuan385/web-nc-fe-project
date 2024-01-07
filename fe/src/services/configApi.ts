import axios from "axios";
import { API } from "config/constant";
import { selectToken, setLogin } from "reduxes/Auth";
import { AuthenticationService } from "./authentication";
import { EnhancedStore } from "@reduxjs/toolkit";

let store: EnhancedStore;

export const injectStore = (_store: EnhancedStore) => {
  store = _store;
};

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.request.use(
  (request) => {
    const token = store.getState().auth.token;
    console.log("access: " + token + " dasdasjlhdaslj");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const prevRequest = error?.config;

    if (error.response.status === 403 && !prevRequest?.sent) {
      console.log("refresh");
      prevRequest.sent = true;

      return AuthenticationService.refresh()
        .then((res) => {
          const newAccessToken = res["access_token"];
          store.dispatch(setLogin({ user: null, token: newAccessToken }));

          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(prevRequest);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    return Promise.reject(error);
  }
);
export default api;
