import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    isConnected: false,
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setSocketConnected } = socketSlice.actions;
export default socketSlice.reducer;
