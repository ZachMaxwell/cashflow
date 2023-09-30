import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import AUTH_TOKEN from '../config_DELETEME';

function TransactionForm() {

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
        const initialFormData = {};
        fieldNames.forEach((fieldName) => {
          if (fieldsAndTypes[fieldName] === 'AutoField') {
            initialFormData[fieldName] = 0;
          } else if (initialFormData[fieldName] === 'DecimalField') {
              initialFormData[fieldName] = 0;
          } else if (initialFormData[fieldName] === 'CharField') {
              initialFormData[fieldName] = '';
          } else if (initialFormData[fieldName] === 'ForeignKey') {
              initialFormData[fieldName] = 0;
          } else {
            initialFormData[fieldName] = '';
          }
        });

        setFormData(initialFormData);

       } else {
          console.error('Unexpected response format:', response.data);
       }
      })
      .catch((error) => {
        console.log('Error fetching fields and types:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [String(name)]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // DELETE: Separating out the ID field for testing purposes
    console.log('Form Data at handle submit:', formData); 
    const {id, ...formDataWithoutId} = formData;
    console.log('Form Data without id at handle submit:', formDataWithoutId);

    // DELETE: Hard-coding the user value to 1 for testing purposes 
    formDataWithoutId.user = 1;
    console.log('Form Data without id and user at handle submit:', formDataWithoutId);

    dispatch(addTransaction(formDataWithoutId));

    try {
      // Make a POST request using Axios
      const response = await axios.post('/api/transactions/create/', formDataWithoutId, {
        headers: {
          'Authentication': `${AUTH_TOKEN}`
        }
      });
      console.log('This is the response being sent to the backend', response);
  
      // Check if the request was successful
      if (response.status === 201) {
        // Handle success, for example, clear the form
        setFormData({
          // Place holder to set the form data back to empty
        });
  
        // Optionally, dispatch an action to update your Redux store
        dispatch(addTransaction(response.data));
      } else {
        // Handle other response statuses or errors
        console.error('Error:', response.status);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error);
    }
  };


  return (

  <Form onSubmit={handleSubmit}>
    {fields
    //.filter(fieldName => fieldName !== 'id')
    .map((fieldName) => (
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
    <Button type="submit" variant="success">
      Add Transaction
    </Button>
  </Form>

  );
};

export default TransactionForm;
