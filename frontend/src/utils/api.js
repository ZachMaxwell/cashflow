import axios from 'axios';
import { getTransactions, getTransactionsSuccess, getTransactionsFailure } from '../features/transactionSlice';
import { getTransactionDetails, getTransactionDetailsSuccess, getTransactionDetailsFailure } from '../features/transactionDetailsSlice';

export const fetchTransactions = async (userInfo, dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
        }
        } 

        const response = await axios.get('/api/transactions/', config);
        
        dispatch(getTransactions(response.data));
        dispatch(getTransactionsSuccess(response.data));

    } catch (error) {
        console.error('An error occurred while fetching transactions from the server', error);
        dispatch(getTransactionsFailure(error));
    }
};

export const fetchTransaction = async (userInfo, id, dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }

        const response = await axios.get(`/api/transactions/${id}`, config);
        console.log('In TransactionDetailsScreen --> fetchTransactionDetails - The repsonse from the server is: ', response.data); 

        dispatch(getTransactionDetails(response.data))
        dispatch(getTransactionDetailsSuccess(response.data))

        } catch (error) {             
        dispatch(getTransactionDetailsFailure(error))
        }
};