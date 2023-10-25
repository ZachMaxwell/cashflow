import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        loading: false,
        error: null,
        isAddingTransaction: false,
        addTransactionSuccess: null,
        addTransactionFailure: null,
        deleteTransactionSuccess: null,
        deleteTransactionFailure: null,
        isEditingTransaction: false,
        editTransactionSuccess: null,
        editTransactionFailure: null,
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
        addTransactionSuccess: (state, { payload }) => {
            state.addTransactionSuccess = payload;
            state.addTransactionFailure = null;
        },
        addTransactionFailure: (state, { payload }) => {
            state.addTransactionFailure = payload;
            state.addTransactionSuccess = null;
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
        editTransaction: (state, { payload }) => {  
            state.transactions = state.transactions.map((transaction) => { // creates a new modified array of transactions and iterates through each transaction
                if (transaction.id === payload.id) { // checks if the id of the current transaction (transaction.id) matches the edited transaction id (payload.id)
                    return payload; // If the IDs match, it returns the payload, which is the edited transaction. This effectively replaces the existing transaction with the edited one in the new array being created.
                } else {
                    return transaction; //  If the IDs don't match, it returns the original transaction unchanged, preserving the transactions that I didn't edit.
                }

            })
        },
        toggleEditTransactionForm: (state) => {
            state.isEditingTransaction = !state.isEditingTransaction;
        },
        editTransactionSuccess: (state, { payload }) => {
            state.editTransactionSuccess = payload;
            state.editTransactionFailure = null;
        },
        editTransactionFailure: (state, { payload }) => {
            state.editTransactionFailure = payload;
            state.editTransactionSuccess = null;
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
    addTransactionSuccess,
    addTransactionFailure,
    deleteTransaction,
    deleteTransactionSuccess,
    deleteTransactionFailure,
    editTransaction,
    toggleEditTransactionForm,
    editTransactionSuccess,
    editTransactionFailure,
    

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
    try {
        await axios.delete(`/api/transactions/delete/${transactionId}`);
        dispatch(deleteTransaction(transactionId));
        dispatch(deleteTransactionSuccess('Transaction deleted successfully!'))
    } catch (error) {
        dispatch(deleteTransactionFailure('Error deleting transaction: ', error.message));
    
    }
};

export default transactionSlice.reducer;