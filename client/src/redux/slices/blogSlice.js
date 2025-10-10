import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchBlogs = createAsyncThunk("blog/fetchBlogs", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/blogs");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || "Fetch failed");
  }
});

const blogSlice = createSlice({
  name: "blog",
  initialState: { blogs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchBlogs.fulfilled, (s, a) => { s.loading = false; s.blogs = a.payload; })
      .addCase(fetchBlogs.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default blogSlice.reducer;
