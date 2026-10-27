import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  token: null,
  isAuthenticated: false,
  followingIds: [], // Stores user IDs currently followed by the logged-in user
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
      state.token = action.payload.tokn;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userData = null;
      state.followingIds = [];
    },
    setFollowingIds: (state, action) => {
      if (!Array.isArray(action.payload)) {
        state.followingIds = [];
        return;
      }
      const unique = new Set(
        action.payload.map((id) => id?.toString()).filter(Boolean)
      );
      state.followingIds = Array.from(unique);
    },
    addFollowingId: (state, action) => {
      const id = action.payload?.toString();
      if (id && !state.followingIds.includes(id)) {
        state.followingIds.push(id);
      }
    },
    removeFollowingId: (state, action) => {
      const id = action.payload?.toString();
      state.followingIds = state.followingIds.filter((item) => item !== id);
    },
  },
});

export const {
  login,
  logout,
  setFollowingIds,
  addFollowingId,
  removeFollowingId,
} = authSlice.actions;

export default authSlice.reducer;
