import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        loading: false,
        error: null,
        isAddingTransaction: false,
        deleteTransactionSuccess: null,
        deleteTransactionFailure: null,
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
        deleteTransaction: (state, { payload }) => {
            const deletedId = payload;
            console.log(payload);
            state.transactions = state.transactions.filter((transaction) => transaction.id !== deletedId);
        },
        deleteTransactionSuccess: (state, { payload }) => {
            state.deleteTransactionSuccess = payload;
            state.deleteTransactionFailure = null;
        },
        deletedeleteTransactionFailure: (state, { payload }) => {
            state.deleteTransactionFailure = payload;
            state.deleteTransactionSuccess = null;
        },  
    },
});

//Export the actions so I can dispatch them in my components
export const { 

    getTransactions, 
    getTransactionsSuccess, 
    getTransactionsFailure, 
    toggleAddTransactionForm, 
    addTransaction,
    deleteTransaction,
    deleteTransactionSuccess,
    deleteTransactionFailure,

    } = transactionSlice.actions;

export const transactionSelector = (state) => state.transactions;

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

//API call to delete a transaction from the /api/transactions/ API endpoint on the Django backend
export const deleteTransactionAsync = (transactionId) => async (dispatch) => {
    try{
        await axios.delete(`/api/transactions/delete/${transactionId}`);
        dispatch(deleteTransaction(transactionId));
        dispatch(deleteTransactionSuccess('Transaction deleted successfully!'))
    } catch (error) {
        dispatch(deleteTransactionFailure('Error deleting transaction: ', error.message));
    
    }
};

export default transactionSlice.reducer;