import React, { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap'
import Transaction from '../components/Transaction'
import AccordionBody from 'react-bootstrap/esm/AccordionBody'
import axios from 'axios'
import { Link } from 'react-router-dom'

function HomeScreen() {

  const [transactions, setTransactions] = useState([])

  useEffect(() => {

      async function fetchTransactions() {

        const { data } = await axios.get('/api/transactions/')
        setTransactions(data)
      }
      
      fetchTransactions()
  }, [])
  console.log("This is me printing out the transactions: ", transactions);
  const reverseChronTransactions = [...transactions].reverse();

  return (
    <div>
        <h1>Welcome back! Here are your transactions:</h1>


          <Accordion defaultActiveKey={['0']} alwaysOpen>
            <Accordion.Item eventKey="0">
              
            <Accordion.Header>
            <h3>2023</h3>
            </Accordion.Header>
              <AccordionBody>
                
                {reverseChronTransactions.map(transaction => (
                
                <div key={transaction.id} sm={12} md={6} lg={4} xl={3} >
                  <Link to={`/transaction/${transaction.id}`}>
		                <Transaction transaction={transaction}/>
                  </Link>
	              </div>
                    
                ))}
        
              </AccordionBody>
              
            </Accordion.Item>
            </Accordion>
    </div>
  );
}

export default HomeScreen