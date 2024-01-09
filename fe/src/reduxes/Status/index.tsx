import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isOpenFilterDialog: Boolean;
}

const initState: InitialState = {
  isOpenFilterDialog: false
};

const statusSlice = createSlice({
  name: "status",
  initialState: initState,
  reducers: {
    openFilterDialog: (state, action: PayloadAction<Boolean>) => {
      state.isOpenFilterDialog = action.payload;
    }
  }
});

export const { openFilterDialog } = statusSlice.actions;

export default statusSlice.reducer;

export const selectOpenFilterDialogStatus = (state: any) => state.status.isOpenFilterDialog;
