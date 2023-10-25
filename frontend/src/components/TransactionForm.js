import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, addTransactionSuccess, addTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import AUTH_TOKEN from '../config_DELETEME';

function TransactionForm() {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState({});
  const [formChoices, setFormChoices] = useState({});
  
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
    
    // NEW - trying to get the form data choices
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
        
        // setFields now contains the fieldNames
        setFields(fieldNames);
        // setFieldTypes now contains the fieldTypes
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
        // Set state for setFormData to the initialFormData
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
      const firstValueChoice = value.split(',')[0];

      console.log(`Changing ${name} to:`, firstValueChoice);

      // takes the already existing form data (e.g. ...formData), and updates the state to include the updated name, value pair (e.g. "month": "Aug")
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

    // DELETE: Separating out the ID field for testing purposes
    console.log('Form Data at handle submit:', formData); 
    const {id, ...formDataWithoutId} = formData;
    console.log('Form Data without id at handle submit:', formDataWithoutId);

    // DELETE: Hard-coding the user value to 1 for testing purposes 
    formDataWithoutId.user = 1;
    console.log('Form Data without id and user at handle submit:', formDataWithoutId);

    //dispatch(addTransaction(formDataWithoutId));

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

  console.log('this is the form data:', formData);
  
  return (
    //.filter(fieldName => fieldName !== 'id')
    

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
