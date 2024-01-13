import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  loading: boolean;
}

const initState: InitialState = {
  loading: false
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initState,
  reducers: {
    loading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { loading } = loadingSlice.actions;

export default loadingSlice.reducer;
