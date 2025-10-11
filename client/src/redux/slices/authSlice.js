// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// =================== Initial State ===================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
  successMessage: null,
};

// =================== Thunks ===================

// 🔹 Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/auth/register", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Registration failed"
      );
    }
  }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data; // { user, accessToken }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Login failed"
      );
    }
  }
);

// 🔹 Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, thunkAPI) => {
    try {
      const res = await API.get(`/auth/verify-email?token=${token}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Verification failed"
      );
    }
  }
);

// 🔹 Fetch Logged-in User Profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;
      if (!token) throw new Error("No token found");

      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data; // user data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch profile"
      );
    }
  }
);

// 🔹 Upload Avatar
export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (file, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.accessToken;

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await API.post("/users/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data; // { avatar: "url" }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Avatar upload failed"
      );
    }
  }
);

// =================== Slice ===================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Logout User
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.successMessage = null;
      state.loading = false;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },

    // 🔹 Manually set access token
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    // 🔹 Clear success/error messages
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // 🟢 Register
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload.msg || "Registration successful";
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // 🟢 Login
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.successMessage = "Login successful";

        localStorage.setItem("user", JSON.stringify(a.payload.user));
        localStorage.setItem("accessToken", a.payload.accessToken);
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // 🟢 Verify Email
      .addCase(verifyEmail.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(verifyEmail.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload.msg || "Email verified successfully";
      })
      .addCase(verifyEmail.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // 🟢 Fetch Profile
      .addCase(fetchProfile.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        localStorage.setItem("user", JSON.stringify(a.payload));
      })
      .addCase(fetchProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // 🟢 Upload Avatar
      .addCase(uploadAvatar.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (s, a) => {
        s.loading = false;
        if (s.user) s.user.avatar = a.payload.avatar;
        s.successMessage = "Avatar updated successfully";
        localStorage.setItem("user", JSON.stringify(s.user));
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
