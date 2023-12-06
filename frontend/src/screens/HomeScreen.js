import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { transactionSelector, toggleAddTransactionForm } from '../features/transactionSlice'
import { fetchTransactions, deleteATransaction } from '../utils/api'
import { Button, Form } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Transaction from '../components/Transaction'
import Loader from '../components/Loader'
import AlertMessage from '../components/AlertMessage'
import TransactionForm from '../components/TransactionForm'
import SearchBar from '../components/SearchBar'

function HomeScreen() {

  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth); 
  const { transactions, loading, error } = useSelector(transactionSelector);
  const isAddingTransaction = useSelector((state) => state.transactions.isAddingTransaction);
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const availableYears = [...new Set(transactions.map(transaction => transaction.date.slice(0,4)))];

  const handleDeleteTransaction = (transactionId) => {
    if (userInfo) { 
      deleteATransaction(userInfo, transactionId, dispatch) 
    } else {
      
      console.error('User information not available for delete operation');
    }
  };
  
  useEffect(() => {
    if (userInfo) {
      fetchTransactions(userInfo, dispatch);
    }
  }, [userInfo, dispatch]);
  
  
  const renderTransactions = () => {
    if (loading) return <Loader />
    if (error) return <AlertMessage variant='danger' message={error.message} />

    let transactionsToRender = filteredTransactions.length > 0 ? filteredTransactions : transactions;

    // Filter transactions based on the selected year, else render the searched transactions OR all transactions
    transactionsToRender = selectedYear
      ? transactionsToRender.filter((transaction) => transaction.date.slice(0,4) === selectedYear)
      : transactionsToRender;

    if (transactionsToRender.length === 0) {
      return <AlertMessage variant='info' message='Please add a new transaction to get started 🌱' />;
    }

    return transactionsToRender.map((transaction) => (
      <Transaction key={transaction.id} transaction={transaction} onDelete={handleDeleteTransaction} />
    ));
  };

  /*
  // If the user hasn't input any transactions yet
    if (transactions.length === 0) {
      return (
        <AlertMessage variant='info' message='Add a new transaction to get started' />
      )
    }
    // If no year is selected, display all transactions
    if (selectedYear === 'Select a year' || selectedYear === '') {
      return transactions.map((transaction) => (
        <Transaction key={transaction.id} transaction={transaction} onDelete={handleDeleteTransaction} />
      ));
    }

    // Filter transactions by selected year
    const filteredTransactions = transactions.filter((transaction) => {
      return transaction.year === selectedYear;
    });

    return filteredTransactions.map((transaction) => (
      <Transaction key={transaction.id} transaction={transaction} onDelete={handleDeleteTransaction} />
    )); 
  };
  */
  
  const handleSearch = (keyword) => {
    console.log(keyword);
    const searchedTransactions = transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(keyword.toLowerCase())
      || transaction.category.toLowerCase().includes(keyword.toLowerCase())
      //make more filter options
    )
    setFilteredTransactions(searchedTransactions);
  }

  return (
    <div>
        <SearchBar onSearch={handleSearch} />
        {userInfo ? (
          <h1>Hi, {userInfo.name}! Here are your transactions:</h1>
        ) : (
          <h1>Hello!</h1>
        )}
        <h2>You have {transactions.length} total transactions</h2>
        <br></br>

        <Button onClick={() => dispatch(toggleAddTransactionForm())} variant='info'>
          {isAddingTransaction ? 'Cancel' : 'Add a new transaction'}
        </Button>
        
        {isAddingTransaction && <TransactionForm />}

              <Card className="my-2 p-2 rounded" style={{ width: '14%' }}>
                <Form.Select 
                
                  aria-label="Default select example"
                  onChange={(e) => {setSelectedYear(e.target.value)}}
                  value={selectedYear}
                  style={{width: '100%'}}

                >
                  <option value="">Select a year</option>
                  {availableYears.map(year => (
                  <option key={year} value={year}>
                      {year}
                  </option>
                  ))}

                </Form.Select>
              </Card>
          
              <Card className="my-1 p-1 rounded" style={{ width: '30rem' }}>

              { renderTransactions() }

              </Card>
              
    </div>
  );
}

export default HomeScreen