import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get("http://localhost:5000/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// ✅ Add new transaction (only admin/owner/kosadhokko)
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post("http://localhost:5000/api/transactions", transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default transactionSlice.reducer;
