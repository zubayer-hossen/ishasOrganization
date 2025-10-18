import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance"; // ✅ FIXED: Using the correct API instance

// ===================== Thunks =====================

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      // Token is added automatically by the Interceptor
      const res = await API.get("/users");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Fetch failed");
    }
  }
);

// Update user (role/verify)
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, data }, thunkAPI) => {
    try {
      // Token is added automatically by the Interceptor
      const res = await API.put(`/users/${userId}/role`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Update failed");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      // Token is added automatically by the Interceptor
      await API.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Delete failed");
    }
  }
);

// ===================== Notices / Blogs =====================

// Fetch all notices (Admin context - might be authenticated)
export const fetchNotices = createAsyncThunk(
  "admin/fetchNotices",
  async (_, thunkAPI) => {
    try {
      // Token is added automatically by the Interceptor
      const res = await API.get("/notices");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Fetch failed");
    }
  }
);

// Add notice
export const addNotice = createAsyncThunk(
  "admin/addNotice",
  async (data, thunkAPI) => {
    try {
      // Token is added automatically by the Interceptor
      const res = await API.post("/notices", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Add failed");
    }
  }
);

// Delete notice
export const deleteNotice = createAsyncThunk(
  "admin/deleteNotice",
  async (id, thunkAPI) => {
    try {
      // Token is added automatically by the Interceptor
      await API.delete(`/notices/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Delete failed");
    }
  }
);

// ===================== Slice =====================

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    notices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchUsers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.users = a.payload; })
      .addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateUser.fulfilled, (s, a) => {
        s.users = s.users.map(u => u._id === a.payload._id ? a.payload : u);
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter(u => u._id !== a.payload);
      })

      // Notices
      .addCase(fetchNotices.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotices.fulfilled, (s, a) => { s.loading = false; s.notices = a.payload; })
      .addCase(fetchNotices.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(addNotice.fulfilled, (s, a) => { 
        // Assuming the backend returns the new notice object
        s.notices.push(a.payload); 
    })
      .addCase(deleteNotice.fulfilled, (s, a) => {
        s.notices = s.notices.filter(n => n._id !== a.payload);
      });
  },
});

export default adminSlice.reducer;
