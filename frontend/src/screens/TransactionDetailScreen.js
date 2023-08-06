import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


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

    if (!transaction) {
        return <div>Loading...</div>
    }

    return (
    <div>
        <h2>Transaction Details: </h2>
        <p>Date: {transaction.month} {transaction.day}, {transaction.year}</p>
        <p>Description: {transaction.description}</p>
        <p>Category: {transaction.category}</p>
        <p>Type: {transaction.type}</p>
        <p>Account: {transaction.account}</p>
        <p>Amount: {transaction.amount}</p>
    </div>
  )
}

export default TransactionDetailScreen