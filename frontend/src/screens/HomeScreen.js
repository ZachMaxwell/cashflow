import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions, transactionSelector } from '../features/transactionSlice'
import { Accordion } from 'react-bootstrap'
import Transaction from '../components/Transaction'
import AccordionBody from 'react-bootstrap/esm/AccordionBody'

function HomeScreen() {

  
  //Introducing useSelector and useDispatch
  const dispatch = useDispatch()
  const { transactions, loading, error } = useSelector(transactionSelector); 

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])
  
  /*
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

    {transactions.map(transaction => (
                
                <div key={transaction.id} sm={12} md={6} lg={4} xl={3} >
                  <Link to={`/transaction/${transaction.id}`}>
		                <Transaction transaction={transaction}/>
                  </Link>
	              </div>
                    
                ))}


  */
  
            
  

  
  const renderTransactions = () => {
    if (loading) return <h2>Loading...</h2>
    if (error) return <h2>Unable to display transactions...{error}</h2>

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