import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    isLoggedIn: false,
    userEmail : null,
    UserId: null,
    token:null
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
      },
      userLogout(state) {
        state.isLoggedIn = false;
        state.userEmail = null
        state.token = null;
        state.UserId=null;
      },
    },
  });
  
  export const { userLogin, userLogout } = authSlice.actions;
  export default authSlice.reducer;