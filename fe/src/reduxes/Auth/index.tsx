import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "models/user";

interface InitialState {
  currentUser: User | null;
  token: string | null;
  isLoggedIn: Boolean;
}

const initState: InitialState = {
  currentUser: null,
  token: null,
  isLoggedIn: false
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    loginStatus: (state, action: PayloadAction<Boolean>) => {
      state.isLoggedIn = action.payload;
    }
  }
});

export const { setLogin, logOut, loginStatus } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.currentUser;
export const selectToken = (state: any) => state.auth.token;
export const selectLoginStatus = (state: any) => state.auth.isLoggedIn;
