import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions, transactionSelector } from '../features/transactionSlice'
import { Accordion } from 'react-bootstrap'
import Transaction from '../components/Transaction'
import AccordionBody from 'react-bootstrap/esm/AccordionBody'
import Loader from '../components/Loader'
import AlertMessage from '../components/AlertMessage'

function HomeScreen() {

  const dispatch = useDispatch()
  const { transactions, loading, error } = useSelector(transactionSelector);

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