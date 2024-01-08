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

export const apiAuth = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
  withCredentials: true
});

export default api;
