// src/services/fundService.js (New File or Update your API Utility)
import api from '../api'; // আপনার Axios instance

const fundService = {
  // সকল ইউজার ও টোটাল ফান্ড আনা হবে
  getFundData: async () => {
    const totalsRes = await api.get('/funds/totals');
    const transactionsRes = await api.get('/funds');

    return {
      totals: totalsRes.data,
      transactions: transactionsRes.data,
    };
  },

  // নতুন লেনদেন তৈরি (Credit/Debit)
  createTransaction: async (txData) => {
    const response = await api.post('/funds', txData);
    return response.data;
  },
};

export default fundService;