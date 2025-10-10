// src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios"; // custom axios instance

// =================== Initial State ===================
// localStorage থেকে data load করা হচ্ছে
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
  successMessage: null, // success messages handle করার জন্য
};

// =================== Thunks ===================

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data; // { msg: "Registered. Check your email..." }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Register failed"
      );
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data; // { user, accessToken }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Login failed"
      );
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verify",
  async (token, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
      return res.data; // { msg: "Email verified. You may now login." }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Verification failed"
      );
    }
  }
);

// Upload Avatar
export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (file, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosInstance.post("/users/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data; // { avatar: 'url' }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Upload failed"
      );
    }
  }
);

// =================== Slice ===================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.successMessage = null;
      state.loading = false;

      // localStorage clear
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload.msg;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Login
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.error = null;
        s.successMessage = "Login successful";

        // ✅ Save to localStorage
        localStorage.setItem("user", JSON.stringify(a.payload.user));
        localStorage.setItem("accessToken", a.payload.accessToken);
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.successMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload.msg;
      })
      .addCase(verifyEmail.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Upload Avatar
      .addCase(uploadAvatar.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (s, a) => {
        s.loading = false;
        if (s.user) s.user.avatar = a.payload.avatar;
        s.successMessage = "Avatar uploaded successfully";
      })
      .addCase(uploadAvatar.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

// =================== Exports ===================
export const { logout, setAccessToken, clearMessages } = authSlice.actions;
export default authSlice.reducer;
