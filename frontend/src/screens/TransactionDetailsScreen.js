import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactionDetails, transactionDetailsSelector } from '../features/transactionDetailsSlice'
import AlertMessage from '../components/AlertMessage'

/*
function TransactionDetailScreen( {match} ) {
    const {id} = useParams()
    const [transaction, setTransaction] = useState(null)


    useEffect(() => {
        async function fetchTransaction(){
            
            try {
                const response = await axios.get(`/api/transactions/${id}`)
                setTransaction(response.data)
            } catch (error) {
                console.log('Error fetching transaction: ', error)
            }
        }

        fetchTransaction()
    }, [id]);
*/

function TransactionDetailScreen() {
    const { id } = useParams();
    console.log('ID: ', id)
    
    const dispatch = useDispatch();
    const { transaction, loading, error } = useSelector(transactionDetailsSelector);
    console.log('right before useEffect...')

    useEffect(() => {
        console.log('Fetching transaction details for ID:', id)
        dispatch(fetchTransactionDetails(id));


    }, [dispatch, id]);

    console.log('transaction: ', transaction)

    
    if (loading) { 
        return <Loader />;

    }

    if (error) { 
        return <AlertMessage variant='danger' message={error.message} />;
    }
    

    let result_amount;
    if (transaction) {
        if (transaction.category === 'Income') {
            result_amount = <font color="green">+${transaction.amount}</font>;
        } else {
            result_amount = <font color="red">-${transaction.amount}</font>;
        }
    }

    return (
         
        <Card className="my-3 p-3 rounded">
            <Card.Body>

                <Card.Title as="h2">
                    <strong>Transaction Details:</strong> 
                </Card.Title>

                {transaction && (
                <div>
                <Card.Text as="h6">
                    {transaction.category}
                </Card.Text>

                <Card.Title as="h4">
                    <strong>{transaction.description}</strong>
                </Card.Title>
            
                <Card.Text as="h3">
                    {result_amount} 
                </Card.Text>

                <Card.Text as="h4">
                    {transaction.type}
                </Card.Text>

                <Card.Title as="div" className="py-2">
                    {transaction.month} {transaction.day}, {transaction.year}
                </Card.Title>

                <Card.Text as="h5">
                    {transaction.account}
                </Card.Text>
                </div>
                )}

            </Card.Body>
        </Card>

  )
};

export default TransactionDetailScreen