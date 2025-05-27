import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  token:null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
       state.isAuthenticated=false,
       state.token=null,
       state.userData= null

    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

