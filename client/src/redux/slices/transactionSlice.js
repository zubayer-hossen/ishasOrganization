import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance"; // ✅ FIXED: Using the configured API instance

// ✅ Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Token is added automatically by the Interceptor. Using relative path.
      const res = await API.get("/transactions"); 
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Fetch transactions failed");
    }
  }
);

// ✅ Add new transaction (only admin/owner/kosadhokko)
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, { rejectWithValue }) => {
    try {
      // Token is added automatically by the Interceptor. Using relative path.
      const res = await API.post("/transactions", transactionData); 
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Add transaction failed");
    }
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
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        // ✅ FIX: action.payload ব্যবহার করা হয়েছে যা thunkAPI.rejectWithValue থেকে আসছে
        state.error = action.payload; 
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default transactionSlice.reducer;
