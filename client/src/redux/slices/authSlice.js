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

// 🔹 Register
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

// 🔹 Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Login failed"
      );
    }
  }
);

// 🔹 ✅ Verify Email (added for your VerifyEmail.jsx)
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, thunkAPI) => {
    try {
      const res = await API.get(`/auth/verify-email?token=${token}`);
      return res.data; // { msg: "Email verified successfully" }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Verification failed"
      );
    }
  }
);

// 🔹 Fetch Profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (!state.auth.accessToken) throw new Error("No token found");
      const res = await API.get("/users/me");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch profile"
      );
    }
  }
);

// =================== Slice ===================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔹 Register
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload.msg || "Registration successful";
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // 🔹 Login
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
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
        s.user = null;
        s.accessToken = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })

      // 🔹 ✅ Verify Email
      .addCase(verifyEmail.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(verifyEmail.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload.msg || "Email verified successfully";
        if (s.user) s.user.isVerified = true;
      })
      .addCase(verifyEmail.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // 🔹 Fetch Profile
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
      });
  },
});

// ✅ Export everything properly
export const {
  setUser,
  setAccessToken,
  logout,
  clearMessages,
} = authSlice.actions;

export default authSlice.reducer;
