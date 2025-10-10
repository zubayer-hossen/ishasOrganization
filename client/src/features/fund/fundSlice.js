// client/src/features/fund/fundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTransactions = createAsyncThunk('fund/fetch', async () => {
  const res = await api.get('/fund');
  return res.data;
});
export const createTransaction = createAsyncThunk('fund/create', async (payload) => {
  const res = await api.post('/fund', payload);
  return res.data;
});

const fundSlice = createSlice({
  name: 'fund',
  initialState: { list: [], status: 'idle' },
  extraReducers: builder => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => { state.list = action.payload; });
    builder.addCase(createTransaction.fulfilled, (state, action) => { state.list.unshift(action.payload); });
  }
});
export default fundSlice.reducer;
