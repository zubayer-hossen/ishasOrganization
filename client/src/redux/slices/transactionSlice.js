import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance"; 

// ✅ Fetch all transactions (User will only get their own due to server logic)
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ FIXED: The correct API route based on server/routes/fund.js
      const res = await API.get("/funds"); 
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch contribution history.");
    }
  }
);

// ✅ Add new transaction
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, { rejectWithValue }) => {
    try {
      // ✅ FIXED: The correct API route based on server/routes/fund.js
      const res = await API.post("/funds", transactionData); 
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
    // ✅ Added a state for the overall balance for user context
    totalContribution: 0, 
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
        // Calculate total contribution after fetching
        state.totalContribution = action.payload
            .filter(t => t.type === 'credit')
            .reduce((acc, t) => acc + t.amount, 0);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Add new transaction to the top
        // Recalculate total if the new transaction is a credit
        if(action.payload.type === 'credit') {
            state.totalContribution += action.payload.amount;
        }
      });
  },
});

export default transactionSlice.reducer;