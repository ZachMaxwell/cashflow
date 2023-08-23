import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        loading: false,
        error: null,
    },
    reducers: {
        getTransactions: (state) => {
            state.loading = true;
        },
        getTransactionsSuccess: (state, { payload }) => {
            state.transactions = payload;
            state.loading = false;
            state.error = null;
        },
        getTransactionsFailure: (state, { payload }) => {
            console.log('error: ', payload)
            state.loading = false;
            state.error = payload;
        },
    },    
});

export const { getTransactions, getTransactionsSuccess, getTransactionsFailure } = transactionSlice.actions;

export const transactionSelector = (state) => state.transactions;

export default transactionSlice.reducer;

export function fetchTransactions() {
    return async (dispatch) => {
      dispatch(getTransactions())
  
      try {
        const response = await axios.get('/api/transactions/');
        const data = response.data
  
        dispatch(getTransactionsSuccess(data))
      } catch (error) {
        dispatch(getTransactionsFailure(error))
      }
    }
  };