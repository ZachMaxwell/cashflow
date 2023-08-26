import { configureStore } from '@reduxjs/toolkit';
import { transactionSlice } from './features/transactionSlice';
import { transactionDetailsSlice } from './features/transactionDetailsSlice';




const store = configureStore({
    reducer: {
        transactions: transactionSlice.reducer,
        transaction: transactionDetailsSlice.reducer,

    }

});

export default store;