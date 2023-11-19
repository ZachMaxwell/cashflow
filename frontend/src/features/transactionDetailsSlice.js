import { createSlice } from '@reduxjs/toolkit';

export const transactionDetailsSlice = createSlice({

    name: 'transaction',
    initialState: {
        transaction: null,
        loading: false,
        error: null,
    },
    reducers: {
        getTransactionDetails: (state) => {
            state.loading = true;
        },
        getTransactionDetailsSuccess: (state, { payload }) => {
            state.transaction = payload;
            state.loading = false;
            state.error = null;
        },
        getTransactionDetailsFailure: (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        },


    }

});

export const { getTransactionDetails, getTransactionDetailsSuccess, getTransactionDetailsFailure } = transactionDetailsSlice.actions;

export const transactionDetailsSelector = (state) => state.transaction;

export default transactionDetailsSlice.reducer;