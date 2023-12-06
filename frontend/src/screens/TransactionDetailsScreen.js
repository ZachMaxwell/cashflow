import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { transactionDetailsSelector } from '../features/transactionDetailsSlice'
import AlertMessage from '../components/AlertMessage'
import { fetchTransaction } from '../utils/api'

function TransactionDetailScreen() {
    const { id } = useParams();
    
    const dispatch = useDispatch();

    const { transaction, loading, error } = useSelector(transactionDetailsSelector);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
           fetchTransaction(userInfo, id, dispatch)
        }
    }, [id, userInfo, dispatch]);
    
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
                    {transaction.date}
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