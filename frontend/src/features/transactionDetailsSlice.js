import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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

export function fetchTransactionDetails(id) {
    return async (dispatch) => {
      dispatch(getTransactionDetails());
  
      try {
        console.log('API Request:', `/api/transactions/${id}`); // Log the request to the console
        const response = await axios.get(`/api/transactions/${id}`);
        const data = response.data;
        console.log('API Response:', data); // Log the response data

  
        dispatch(getTransactionDetailsSuccess(data))
      } catch (error) {
        console.log('API Error:', error); // Log the error to the console
        
        dispatch(getTransactionDetailsFailure(error))
      }
    }
  };