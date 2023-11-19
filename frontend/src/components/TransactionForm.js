import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, addTransactionSuccess, addTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from "react-redux";

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
    
    // Getting the form data choices (for those of them that have choices in the db)
    axios.get('/api/transaction-model-form-data-choices')
      .then((response) => {
        if (response.data.form_data_choices) {
          const formDataChoices = response.data.form_data_choices;
          console.log('formDataChoices', formDataChoices);
         
       setFormChoices(formDataChoices);
      }
    })
    

    axios.get('/api/transaction-model-fields-and-types')
      .then((response) => {
        if (response.data.fields_and_types) {
          // gets the full array of fields with their associated types from the response object
          const fieldsAndTypes = response.data.fields_and_types;
          // gets the key value from fieldsAndTypes object which is the name of the field
          const fieldNames = Object.keys(fieldsAndTypes);
          console.log('fieldNames', fieldNames);
          console.log('fieldsAndTypes', fieldsAndTypes);
        
        // setFields now contains the fieldNames as an array (e.g. [amount, day, month, year, category, transaction_type, description, account])
        setFields(fieldNames);
        // setFieldTypes now contains the fieldsAndTypes as an object (e.g. {amount: 'DecimalField', day: 'CharField', etc.})
        setFieldTypes(fieldsAndTypes);
        // set initialForm data to an empty array
        const initialFormData = {};
        // loop through the fieldNames array and set initial values for each field depending on the data type 
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

       } else {
          console.error('Unexpected response format:', response.data);
       }
      })
      .catch((error) => {
        console.log('Error fetching fields and types:', error);
      });
  }, []);

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
