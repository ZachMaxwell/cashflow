import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, addTransactionSuccess, addTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from "react-redux";
import { fetchTransactionModelFormDataChoices, fetchTransactionModelFieldsAndTypes } from '../utils/api';

function TransactionForm() {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState({});
  const [formChoices, setFormChoices] = useState({});

  const { userInfo } = useSelector((state) => state.auth);

  const fieldDisplayNames = {
    user: 'User',
    amount: 'Amount',
    day: 'Day',
    month: 'Month',
    year: 'Year',
    description: 'Description',
    transaction_type: 'Type of transaction',
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
    const fetchBackendMetaData = async () => {
      if (userInfo) {
        try {
        
          const backendModelFormChoices = await fetchTransactionModelFormDataChoices(userInfo, dispatch);
          setFormChoices(backendModelFormChoices);

          const { fieldNames, fieldsAndTypes } = await fetchTransactionModelFieldsAndTypes(userInfo, dispatch);
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
          // Set state for setFormData to the initialFormData based on the above forEach statement
          setFormData(initialFormData);
        } catch (error) {
            console.log('Error fetching backend metadata...', error)
        }
      }
    }
    fetchBackendMetaData();
  }, [userInfo, dispatch]);

  // handleInputChange changes whenever the user makes a change (e.g. selects a value from a dropdown, or types in a value)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // if the "value", (e.g. the value in the drop down that comes from the form_data_choices API call) includes a comma, then split the string 
    // and take the first value (e.g. "Aug")
    if (value.includes(',')) {
      console.log(value)
      const firstValueChoice = value.split(',')[0];

      console.log(`Changing ${name} to:`, firstValueChoice);

      // takes the already existing form data (e.g. ...formData), and updates the formData state to include the updated name, value pair (e.g. "month": "Aug")
      setFormData({
        ...formData,
        [String(name)]: firstValueChoice,
      });

      // else if it doesn't include a ',', then just set the name equal to that value
    } else {

      console.log(`Changing ${name} to:`, value);

      setFormData({
        ...formData,
        [String(name)]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataWithUserID = {
      ...formData,
      user: userInfo.user_id
    }
    console.log('Form Data with user ID in TransactionForm -> handleSubmit:', formDataWithUserID); 

    try {
      // Make a POST request using Axios
      const response = await axios.post('/api/transactions/create/', formDataWithUserID, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      console.log('In TransactionForm -> handleSubmit: This is the response being sent from the backend after POST', response);
  
      // Check if the request was successful
      if (response.status === 201) {
        // Handle success & clear the form
        setFormData({
          // Place holder to set the form data back to empty in the future
        });
  
        // Dispatch addTransaction action to update the Redux store
        dispatch(addTransaction(response.data));
        dispatch(addTransactionSuccess('Transaction added successfully!'));
      } else {
        // Handle other response statuses or errors
        console.error('Error:', response.status);
        dispatch(addTransactionFailure('Error adding transaction: ', response.status));
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error);
      dispatch(addTransactionFailure('Error adding transaction: ', error.message));
    }
  };
  
  return (
    
    <Form onSubmit={handleSubmit}>
      {fields.map((fieldName) => (
        <div key={fieldName} className="form-group row">
          <label className="col-sm-3 col-form-label">{fieldDisplayNames[fieldName] || fieldName}:</label>
          <div className="col-sm-9">
            {formChoices[fieldName] ? (
              <Form.Select
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleInputChange}
                className="form-select"
                required
                style={{ width: '30%', maxWidth: '150px' }}
              >
                <option value="">Select {fieldDisplayNames[fieldName]}</option>
                {formChoices[fieldName].map((choice, index) => (
                  <option key={index} value={choice[0]}>{choice[0]}</option>
                ))}
              </Form.Select>
            
            ) : (
              <input
                type={databaseFieldTypesToHTMLFieldTypes[fieldTypes[fieldName]]}
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleInputChange}
                className="form-control"
                required
                style={{ width: '30%', maxWidth: '150px' }}
              />
            )}
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
