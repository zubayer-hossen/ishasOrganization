import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Fetch member profile
export const fetchProfile = createAsyncThunk(
  "member/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const res = await axios.get("/member/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Fetch failed");
    }
  }
);

// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  "member/fetchTransactions",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const res = await axios.get("/member/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Fetch failed");
    }
  }
);

// Add transaction
export const addTransaction = createAsyncThunk(
  "member/addTransaction",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const res = await axios.post("/member/transactions", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || "Add failed");
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState: {
    profile: null,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; })
      .addCase(fetchProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // Transactions
      .addCase(fetchTransactions.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTransactions.fulfilled, (s, a) => { s.loading = false; s.transactions = a.payload; })
      .addCase(fetchTransactions.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // Add Transaction
      .addCase(addTransaction.fulfilled, (s, a) => {
        s.transactions.push(a.payload);
      });
  },
});

export default memberSlice.reducer;
