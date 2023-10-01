import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editTransaction, editTransactionSuccess, editTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import AUTH_TOKEN from '../config_DELETEME';

function EditTransactionForm({ transaction, onSave, onCancel }) {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const [fieldTypes, setFieldTypes] = useState({});

    const fieldDisplayNames = {
        user: 'User',
        amount: 'Amount',
        day: 'Day',
        month: 'Month',
        year: 'Year',
        description: 'Description',
        transaction_type: 'Expense, Income or Savings & Investment',
        category: 'Category',
        account: 'Account',
      };
      
      const databaseFieldTypesToHTMLFieldTypes = {
        CharField: 'text',
        DecimalField: 'number',
        AutoField: 'number',
        ForeignKey: 'number',
    
      };
    
    useEffect(() => {
        axios.get('/api/transaction-model-fields-and-types')
            .then((response) => {
                if (response.data.fields_and_types) {
                    const fieldsAndTypes = response.data.fields_and_types;
                    const fieldNames = Object.keys(fieldsAndTypes);
                    setFields(fieldNames);
                    setFieldTypes(fieldsAndTypes);
                } else {
                    console.log('Unexpected response format: ', response.data);
                }
            })
            .catch((error) => {
                console.log('Error fetching fields and types:', error);
            });
    }, []);

    useEffect(() => {
        setFormData(transaction);
    }, [transaction]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData,  
            [name]: value 
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/transactions/update/${transaction.id}/`, formData, {
                headers: {
                    'Authentication': `${AUTH_TOKEN}`
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
        <div>
          <h3>Edit Transaction</h3>
          <Form onSubmit={handleSubmit}>
            {fields.map((fieldName) => (
              <div key={fieldName} className="form-group row">
                <label className="col-sm-3 col-form-label">{fieldDisplayNames[fieldName] || fieldName}:</label>
                <div className="col-sm-9">
                  <input
                    type={databaseFieldTypesToHTMLFieldTypes[fieldTypes[fieldName]]}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    style={{ width: '30%', maxWidth: '150px' }}
                  />
                </div>
              </div>
            ))}
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Form>
        </div>
    );
}


export default EditTransactionForm;