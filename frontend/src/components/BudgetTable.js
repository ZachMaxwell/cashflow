import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchTransactions } from '../utils/api';
import { useDispatch } from 'react-redux';
import { transactionSelector } from '../features/transactionSlice';
import Loader from './Loader';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

const BudgetTable = () => {

    const { transactions, loading, error } = useSelector(transactionSelector); // will be used to compare the budgeted values against
    //const budget = useSelector(state => state.budget); // will be used to compare the actual transaction values against
    const { userInfo } = useSelector((state) => state.auth); ; // holds the userInfo information
    const dispatch = useDispatch(); // dispatches actions to the store

    useEffect(() => {
        if (userInfo) {
          fetchTransactions(userInfo, dispatch)
        }
      }, [userInfo, dispatch]);

    console.log(transactions)

    // TO DO - Need to break this down by year

    const currentTotalExpenses = transactions.reduce((total, transaction) => {
        if (transaction.transaction_type === 'Expense') {
            return total + transaction.amount
        }
        return total;
    }, 0)

    const currentTotalIncome = transactions.reduce((total, transaction) => {
        if (transaction.transaction_type === 'Income') {
            return total + transaction.amount
        }
        return total;
    
    }, 0)

    console.log(currentTotalExpenses, currentTotalIncome)

    const initialRows = [
        {}
    ]

    return (
        <p>placeholder for BudgetTable</p>
    )



}

export default BudgetTable;