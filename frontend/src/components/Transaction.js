import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'




function Transaction({ transaction }) {
    let result_amount;
    if (transaction.type === 'income') {
        result_amount = <font color="green">+${transaction.amount}</font>;
    } else {
        result_amount = <font color="red">-${transaction.amount}</font>;
    }

    return (
    <Link to={`transaction/${transaction.id}`}>
        <Card className="my-3 p-3 rounded">
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
        </Card>
    </Link>
  );
}



export default Transaction