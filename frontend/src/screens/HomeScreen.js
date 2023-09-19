import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions, transactionSelector, toggleAddTransactionForm } from '../features/transactionSlice'
import { Accordion, Button } from 'react-bootstrap'
import Transaction from '../components/Transaction'
import AccordionBody from 'react-bootstrap/esm/AccordionBody'
import Loader from '../components/Loader'
import AlertMessage from '../components/AlertMessage'
import TransactionForm from '../components/TransactionForm'

function HomeScreen() {

  const dispatch = useDispatch()

  const { transactions, loading, error } = useSelector(transactionSelector);
  const isAddingTransaction = useSelector((state) => state.transactions.isAddingTransaction);

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])
  
  const renderTransactions = () => {
    if (loading) return <Loader />
    if (error) return <AlertMessage variant='danger' message={error.message} />

    return (transactions.map((transaction) => <Transaction key={transaction.id} transaction = {transaction} />));
  }

  return (
    <div>
        <h1>Welcome back! Here are your transactions:</h1>

        <Button onClick={() => dispatch(toggleAddTransactionForm())} variant='secondary'>
          {isAddingTransaction ? 'Cancel' : 'Add New Transaction'}
        </Button>

        {isAddingTransaction && <TransactionForm />}

          <Accordion defaultActiveKey={['0']} alwaysOpen>
            <Accordion.Item eventKey="0">
              
            <Accordion.Header>
            <h3>2023</h3>
            </Accordion.Header>
              <AccordionBody>

              { renderTransactions() }
        
              </AccordionBody>
              
            </Accordion.Item>
            </Accordion>
    </div>
  );
}

export default HomeScreen