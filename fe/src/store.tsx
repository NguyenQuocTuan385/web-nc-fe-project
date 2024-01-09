import { configureStore } from "@reduxjs/toolkit";
import statusReducer from "reduxes/Status/index";
import authReducer from "reduxes/Auth/index";

export const store = configureStore({
  reducer: {
    status: statusReducer,
    auth: authReducer
  },
  // middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(ap)
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
