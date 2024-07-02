import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userEmail: null,
  UserId: null,
  token: null,
  isActive: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogin(state, action) {
      console.log('userLogin action payload:', action.payload);
      state.isLoggedIn = true;
      state.userEmail = action.payload.userEmail;
      state.token = action.payload.token;
      state.UserId = action.payload._id;
      state.isActive = action.payload.isActive;
    },
    userLogout(state) {
      state.isActive = true;
      state.isLoggedIn = false;
      state.userEmail = null;
      state.token = null;
      state.UserId = null;
    },
    updateUserStatus(state, action) {
      state.isActive = action.payload.isActive;
    }
  },
});

export const { userLogin, userLogout, updateUserStatus } = authSlice.actions;
export default authSlice.reducer;
