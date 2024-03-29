import { createSlice } from "@reduxjs/toolkit";

const autSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
  },

  reducers: {
    // Login
    loginStart: (state) => {
      state.login.isFetching = true;
    },

    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },

    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },

    // Register
    registerStart: (state) => {
      state.register.isFetching = true;
    },

    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },

    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },

    // Logout
    logOutStart: (state) => {
      state.login.isFetching = true;
    },
    logOutSuccess: (state) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = false;
    },

    logOutFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerFailed,
  registerSuccess,
  logOutStart,
  logOutSuccess,
  logOutFailed,
} = autSlice.actions;

export default autSlice.reducer;
