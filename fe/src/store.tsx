import { configureStore } from "@reduxjs/toolkit";
import statusReducer from "reduxes/Status/index";
import selectedReducer from "reduxes/Selected/index";

export const store = configureStore({
  reducer: {
    status: statusReducer,
    selected: selectedReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
