import axios from "axios";
import { API } from "config/constant";
import { loginStatus, selectToken, setLogin } from "reduxes/Auth";
import { AuthenticationService } from "./authentication";
import { EnhancedStore } from "@reduxjs/toolkit";
import Userservice from "./user";
import { EStorageKey } from "models/general";

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
      prevRequest.sent = true;

      AuthenticationService.refresh()
        .then((res) => {
          const newAccessToken = res["access_token"];
          store.dispatch(setLogin({ token: newAccessToken }));

          Userservice.getUserbyId(Number(localStorage.getItem(EStorageKey.uid.toString()))).then(
            (res) => {
              store.dispatch(setLogin({ user: res, token: newAccessToken }));
              store.dispatch(loginStatus(true));

              prevRequest.headers.Authorization = `Bearer ${store.getState().auth.token}`;
              console.log(prevRequest);
              return api(prevRequest);
            }
          );
        })
        .catch((e) => {
          if (e.response.status === 403) {
            console.log("Your Login Session has expired");
          }
        });
    }

    return Promise.reject(error);
  }
);

export const apiAuth = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
  withCredentials: true
});

export default api;
