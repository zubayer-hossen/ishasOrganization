import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchNotices = createAsyncThunk("notice/fetchNotices", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/notices");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || "Fetch failed");
  }
});

const noticeSlice = createSlice({
  name: "notice",
  initialState: { notices: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotices.fulfilled, (s, a) => { s.loading = false; s.notices = a.payload; })
      .addCase(fetchNotices.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default noticeSlice.reducer;
