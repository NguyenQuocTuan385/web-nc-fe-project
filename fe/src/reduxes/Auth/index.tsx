import { Token } from "@mui/icons-material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "models/user";

interface InitialState {
  currentUser: User | null;
  token: string | null;
}

const initState: InitialState = {
  currentUser: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    logOut: (state, action: PayloadAction<any>) => {
      state.currentUser = null;
      state.token = null;
    }
  }
});

export const { setLogin, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.currentUser;
export const selectToken = (state: any) => state.auth.token;
