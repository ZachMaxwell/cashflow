import { configureStore } from '@reduxjs/toolkit';
import { transactionSlice } from './features/transactionSlice';
import { transactionDetailsSlice } from './features/transactionDetailsSlice';
import { authSlice } from './features/authSlice';

const store = configureStore({
    reducer: {
        transactions: transactionSlice.reducer, // transactions reducer
        transaction: transactionDetailsSlice.reducer, // transactionDetail reducer
        auth: authSlice.reducer,

    }

});

export default store;