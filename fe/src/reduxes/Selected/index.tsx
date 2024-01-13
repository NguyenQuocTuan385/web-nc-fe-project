import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  parentIndex: number;
  childIndex: number;
}

const initState: InitialState = {
  parentIndex: 0,
  childIndex: -1
};

const selectedSlice = createSlice({
  name: "selected",
  initialState: initState,
  reducers: {
    selected: (state, action: PayloadAction<InitialState>) => {
      state.parentIndex = action.payload.parentIndex;
      state.childIndex = action.payload.childIndex;
    }
  }
});

export const { selected } = selectedSlice.actions;

export default selectedSlice.reducer;
