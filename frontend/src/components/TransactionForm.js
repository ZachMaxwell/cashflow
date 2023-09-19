import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../features/transactionSlice';
import { Container, Form, Button } from 'react-bootstrap';

function TransactionForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    month: '',
    day: '',
    year: '',
    account: '',
    type: '',
    category: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(addTransaction(formData));

    setFormData({
        description: '',
        amount: 0,
        month: '',
        day: '',
        year: '',
        account: '',
        type: '',
        category: '',
    });
  };

  return (
    <Container>
        <h2>Add a New Transaction</h2>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="description">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="amount">
            <Form.Label>Amount:</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="month">
            <Form.Label>Month:</Form.Label>
            <Form.Control
              type="text"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="day">
            <Form.Label>Day:</Form.Label>
            <Form.Control
              type="number"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="year">
            <Form.Label>Year:</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category:</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="type">
            <Form.Label>Type:</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="account">
            <Form.Label>Account:</Form.Label>
            <Form.Control
              type="text"
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          
          <Button type="submit" variant="secondary">
            Add Transaction
          </Button>
        </Form>
  </Container>
);
}

export default TransactionForm;
