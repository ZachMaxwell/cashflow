import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions, transactionSelector, toggleAddTransactionForm, deleteTransactionAsync, updateTransactionAsync } from '../features/transactionSlice'
import { Accordion, Button, Form } from 'react-bootstrap'
import Transaction from '../components/Transaction'
import Loader from '../components/Loader'
import AlertMessage from '../components/AlertMessage'
import TransactionForm from '../components/TransactionForm'

function HomeScreen() {

  const dispatch = useDispatch()

  const { transactions, loading, error } = useSelector(transactionSelector);
  const isAddingTransaction = useSelector((state) => state.transactions.isAddingTransaction);

  const [selectedYear, setSelectedYear] = useState('');
  console.log('Initial state of selectedYear:', selectedYear);
  console.log('Initial array of transactions from Redux store:', transactions)

  const handleDeleteTransaction = (transactionId) => {
    dispatch(deleteTransactionAsync(transactionId))
    console.log('In handleDeleteTransaction - The transactionId passed in is: ', transactionId);
  };

  /*
  const handleUpdateTransaction = (transactionId) => {
    dispatch(updateTransactionAsync(transactionId))
    console.log('In handleUpdateTransaction - The transactionId passed in is: ', transactionId);
  };
  */

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])
  
  const renderTransactions = () => {
    if (loading) return <Loader />
    if (error) return <AlertMessage variant='danger' message={error.message} />

      // If no year is selected, return all transactions
    if (selectedYear === 'Select a year' || selectedYear === '') {
      return transactions.map((transaction) => (
        <Transaction key={transaction.id} transaction={transaction} onDelete={handleDeleteTransaction} />
      ));
    }
    // Filter transactions by selected year
    const filteredTransactions = transactions.filter((transaction) => {
      return transaction.year === selectedYear;
    });
    console.log('In renderTransactions - These are the filtered transactions: ', filteredTransactions);
    console.log('In renderTransactions - The current selected year is: ', selectedYear);

    return filteredTransactions.map((transaction) => (
      <Transaction key={transaction.id} transaction={transaction} onDelete={handleDeleteTransaction} />
    )); 
  };

  /* TO DO: make renderTransactionForm a function 
  const renderTransactionForm = () => {

  }
  */

  

  return (
    <div>
        <h1>Welcome back! Here are your transactions:</h1>
        <h2>You have {transactions.length} total transactions</h2>
        <br></br>
        <Button onClick={() => dispatch(toggleAddTransactionForm())} variant='info'>
          {isAddingTransaction ? 'Cancel' : 'Add New Transaction'}
        </Button>
        
        {isAddingTransaction && <TransactionForm />}
      
          <Accordion defaultActiveKey={['0']} alwaysOpen>
            <Accordion.Item eventKey="0">
              
            <Accordion.Header>
            
            <Form.Select 
            
              aria-label="Default select example"
              onChange={(e) => {setSelectedYear(e.target.value)}}
              value={selectedYear}

            >
              <option>Select a year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </Form.Select>


            </Accordion.Header>
             

              { renderTransactions() }
        
              
              
            </Accordion.Item>
            </Accordion>
    </div>
  );
}

export default HomeScreen