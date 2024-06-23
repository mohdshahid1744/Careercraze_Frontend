import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    isLoggedIn: false,
    UserId: null,
    recruiterEmail : null,
    token:null
  };

  const authSlice = createSlice({
    name: 'recruiter',
    initialState,
    reducers: {
      recruiterLogin(state, action) {
        state.isLoggedIn = true;
        state.UserId = action.payload._id;
        state.recruiterEmail = action.payload.userEmail;
        state.token = action.payload.token;
      },
      recruiterLogout(state) {
        state.isLoggedIn = false;
        state.UserId = null;
        state.recruiterEmail = null
        state.token = null;
      },
    },
  });
  
  export const { recruiterLogin, recruiterLogout } = authSlice.actions;
  export default authSlice.reducer;