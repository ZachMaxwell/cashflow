import axios from 'axios';
import { 
    getTransactions, 
    getTransactionsSuccess, 
    getTransactionsFailure, 
    //addTransaction,
    //addTransactionSuccess,
    //addTransactionFailure,
    deleteTransaction,
    deleteTransactionSuccess,
    deleteTransactionFailure,

} from '../features/transactionSlice';

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

export const fetchTransactionModelFormDataChoices = async (userInfo, dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }

        const response = await axios.get('/api/transaction-model-form-data-choices/', config);
        if (response.data.form_data_choices) {
            return response.data.form_data_choices;
        } else {
            console.log('Unexpected response format:', response.data)
            throw new Error('Unexpected response format')
        }
    } catch (error) {
        console.error('An error occurred while fetching transaction model form data choices from the server');
        throw error;
    }
};

export const fetchTransactionModelFieldsAndTypes = async (userInfo, dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        } 
        
        const response = await axios.get('/api/transaction-model-fields-and-types/', config);
        if (response.data.fields_and_types) {
            const fieldsAndTypes = response.data.fields_and_types;
            const fieldNames = Object.keys(fieldsAndTypes);
            return { fieldNames, fieldsAndTypes };
        } else {
            console.log('Unexpected response format:', response.data)
            throw new Error('Unexpected response format')
        }
    } catch (error) {
        console.log('An error occured while fetching transaction model fields and types from the server: ', error)
        throw error;
    } 

};

/*
export const createTransaction = async (userInfo, formData, dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }

        const response = await axios.post('/api/transactions/', formData, config);
        dispatch(addTransaction(response.data));
        dispatch(addTransactionSuccess('Transaction added successfully!'));

    } catch (error) {

    }

}
*/

export const deleteATransaction = async (userInfo, transactionId, dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        const response = await axios.delete(`/api/transactions/delete/${transactionId}`, config);
        dispatch(deleteTransaction(transactionId));
        dispatch(deleteTransactionSuccess('Transaction deleted successfully!', response.data));
        
    } catch (error) {
        console.log('An error occured while deleting a transaction: ', error)
        dispatch(deleteTransactionFailure('Error deleting transaction: ', error.message));
        
    }
        
};
