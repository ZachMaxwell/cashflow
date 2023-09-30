import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function Transaction({ transaction, onDelete, onEdit }) {
    let result_amount;
    if (transaction.category === 'Income') {
        result_amount = <font color="green">+${transaction.amount}</font>;
    } else {
        result_amount = <font color="red">-${transaction.amount}</font>;
    }

    return (
    
        <Card className="my-3 p-3 rounded">
        <Link to={`transaction/${transaction.id}`}> 
            <Card.Body>

                <Card.Title as="h4">
                    <strong>{transaction.description}</strong>
                </Card.Title>
        
                <Card.Text as="h6">
                    {transaction.category}
                </Card.Text>
            
                <Card.Text as="h3">
                    {result_amount} 
                </Card.Text>

                <Card.Title as="div" className="py-2">
                    <strong>{transaction.month} {transaction.day}, {transaction.year}</strong>
                </Card.Title>

            </Card.Body>
        </Link>

        <Card.Body>
        <Button 
            style={{ padding: '5px 10px', fontSize: '14px' }}
            onClick={() => onDelete(transaction.id)} variant="danger"
        >
            Delete
        </Button>
        
        <Button
            style={{ padding: '5px 10px', fontSize: '14px', marginRight: '100px' }}
            onClick={() => onEdit(transaction.id)} variant="warning"
        >
            Edit
        </Button>

        </Card.Body>

        </Card> 
  );
}



export default Transaction