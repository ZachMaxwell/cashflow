import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, addTransactionSuccess, addTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from "react-redux";
import { fetchTransactionModelFormDataChoices } from '../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function TransactionForm() {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [formChoices, setFormChoices] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBackendMetaData = async () => {
      if (userInfo) {
        try {
          const backendModelFormChoices = await fetchTransactionModelFormDataChoices(userInfo, dispatch);
          setFormChoices(backendModelFormChoices);
          const initialFormData = {};
          setFormData(initialFormData);
        } catch (error) {
            console.log('Error fetching backend metadata...', error)
            throw error;
        }
      }
  }
  fetchBackendMetaData();
  }, [userInfo, dispatch]);
  
  // handleInputChange changes whenever the user makes a change (e.g. selects a value from a dropdown, or types in a value)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`Changing ${name} to: `, value)
    setFormData({
      ...formData,
      [name]: value,
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataWithUserID = {
      ...formData,
      user: userInfo.user_id,
      date: selectedDate.toISOString().slice(0, 10),
      amount: parseFloat(formData.amount),
    }
    console.log('this is the form data with user id and hopefully date being sent to the backend on handleSubmit', formDataWithUserID)

    try {
      const response = await axios.post('/api/transactions/create/', formDataWithUserID, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      if (response.status === 201) {
        // Handle success & clear the form
        setFormData({});
  
        // Dispatch addTransaction action to update the Redux store
        dispatch(addTransaction(response.data));
        dispatch(addTransactionSuccess('Transaction added successfully!'));
      } else {
        // Handle other response statuses or errors
        dispatch(addTransactionFailure('Error adding transaction: ', response.status));
      }
    } catch (error) {
      // Handle network errors or other exceptions
      dispatch(addTransactionFailure('Error adding transaction: ', error.message));
    }
  };

  return (

    <Form onSubmit={handleSubmit}>
      <h3><strong>Add transaction</strong></h3>

      <div className='form-group row'>
          <div>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-control"
              style={{ height: '150%', width: '70%', maxWidth: '205px' }}
              placeholder='Amount'
              required
            />
          </div>
        </div>
        <br/>

        <div>
          <div>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              className="form-control"
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>
        </div>
        <br/>

        <div className='form-group row'>
          <div>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              style={{ height: '150%', width: '70%', maxWidth: '205px' }}
              placeholder='Description'
              required
            />
          </div>
        </div>
        <br/>

        <div className='form-group row'>
          <div>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              className="form-control"
              style={{ height: '150%', width: '70%', maxWidth: '205px' }}
              placeholder='Account name'
              required
            />
          </div>
        </div>
        <br/>

        <Form.Select
          name="transaction_type"
          value={formData.transaction_type || ''}
          onChange={handleInputChange}
          className="form-select"
          style={{ width: '70%', maxWidth: '205px' }}
          required
        >
          <option value="">Select Transaction Type:</option>
          {formChoices.transaction_type?.map((choice, index) => (
            <option key={index} value={choice[0]}>{choice[0]}</option>
          ))}
        </Form.Select>
        <br/>

        {formData.transaction_type === 'Expense' && (
          <Form.Select
            name="category"
            value={formData.category || ''}
            onChange={handleInputChange}
            className='form-select'
            style={{ height: '150%', width: '70%', maxWidth: '205px' }}
            required
          >
            <option value="">Select Expense Category:</option>
            {formChoices.category?.map((choice, index) => (
              <option key={index} value={choice[0]}>{choice[0]}</option>
            ))}
    
          </Form.Select>
        )}
        <br/>

        <Button type="submit" variant="success">
          Add Transaction
        </Button>
    </Form>
  );
};

export default TransactionForm;