import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editTransaction, editTransactionSuccess, editTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { fetchTransactionModelFieldsAndTypes, fetchTransactionModelFormDataChoices } from '../utils/api';
import { fieldDisplayNames, databaseFieldTypesToHTMLFieldTypes } from '../utils/constants'
import DatePicker from 'react-datepicker';
//import { format } from 'date-fns-tz';

function EditTransactionForm({ transaction, onSave, onCancel }) {

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const [fieldTypes, setFieldTypes] = useState({});
    const [formChoices, setFormChoices] = useState({});
    const [selectedDate, setSelectedDate] = useState();
    
    useEffect(() => {
       const fetchBackendMetaData = async () => {
        if (userInfo) {
          try {
            const backendModelFormChoices = await fetchTransactionModelFormDataChoices(userInfo, dispatch);
            setFormChoices(backendModelFormChoices);

            const { fieldNames, fieldsAndTypes } = await fetchTransactionModelFieldsAndTypes(userInfo, dispatch);
            setFields(fieldNames);
            setFieldTypes(fieldsAndTypes);
          } catch (error) {
            console.log('Error fetching backend metadata', error);  
          }
        }
      }
       fetchBackendMetaData();
    }, [userInfo, dispatch]);

    useEffect(() => {
      setFormData(transaction);
    }, [transaction]);

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      console.log(`Changing ${name} to:`, value);
      setFormData({ 
          ...formData,  
          [name]: value 
      });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataWithUserID = {
          ...formData,
          user: userInfo.user_id,
          date: selectedDate.toISOString().slice(0, 10),
        }

        try {
            const response = await axios.put(`/api/transactions/update/${transaction.id}/`, formDataWithUserID, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userInfo.token}`
                }
            });

            if (response.status === 201) {
                onSave(response.data);
                dispatch(editTransaction(response.data))
                dispatch(editTransactionSuccess('Transaction updated successfully!'))
            } else {
                console.log('Error: ', response.status);
                dispatch(editTransactionFailure('Error updating transaction: ', response.status))
            }
        } catch (error) {
            console.log('Error:', error);
            dispatch(editTransactionFailure('Error updating transaction: ', error.message))
        
        }
       
    };

    return (
      <Form onSubmit={handleSubmit}>
          <h3><strong>Edit Transaction</strong></h3>

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
                  placeholderText="Date"
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
                <option value="">Select Category:</option>
                {formChoices.category?.map((choice, index) => (
                  <option key={index} value={choice[0]}>{choice[0]}</option>
                ))}
              </Form.Select>

            )}
            <br/>
            
            <Button 
              type="submit" 
              variant="primary"
              style={{ padding: '5px 10px', fontSize: '14px' }}
            >
              Save
            </Button>{' '}
            <Button 
              variant="secondary" 
              onClick={onCancel}
              style={{ padding: '5px 10px', fontSize: '14px' }}
            >
              Cancel
            </Button>
          </Form>
    );
}


export default EditTransactionForm;