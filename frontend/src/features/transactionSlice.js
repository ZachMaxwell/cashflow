import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        loading: false,
        error: null,
        isAddingTransaction: false,
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
        addTransaction: (state, { payload }) => {
            state.transactions.push(payload);
        },
        toggleAddTransactionForm: (state) => {
            state.isAddingTransaction = !state.isAddingTransaction;
        },
    },    
});

//Export the actions so I can dispatch them in my components
export const { getTransactions, getTransactionsSuccess, getTransactionsFailure, toggleAddTransactionForm, addTransaction } = transactionSlice.actions;

export const transactionSelector = (state) => state.transactions;

export default transactionSlice.reducer;

//API call to fetch the transactions from the /api/transactions/ API endpoint on the Django backend
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