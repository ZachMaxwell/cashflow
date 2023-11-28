import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editTransaction, editTransactionSuccess, editTransactionFailure } from '../features/transactionSlice';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { fetchTransactionModelFieldsAndTypes, fetchTransactionModelFormDataChoices } from '../utils/api';
import { fieldDisplayNames, databaseFieldTypesToHTMLFieldTypes } from '../utils/constants'

function EditTransactionForm({ transaction, onSave, onCancel }) {

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const [fieldTypes, setFieldTypes] = useState({});
    const [formChoices, setFormChoices] = useState({});
    
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        console.log(`Changing ${name} to:`, value);
        
        setFormData({ 
            ...formData,  
            [name]: value 
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataWithUserID = {
          ...formData,
          user: userInfo.user_id
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
        <div>
          <h3>Edit Transaction</h3>
          <Form onSubmit={handleSubmit}>
            {fields.map((fieldName) => (
              <div key={fieldName} className="form-group row">
                <label className="col-sm-3 col-form-label">{fieldDisplayNames[fieldName] || fieldName}:</label>
                <div className="col-sm-9">
                  {formChoices[fieldName] ? (
                  <Form.Select
                    type={databaseFieldTypesToHTMLFieldTypes[fieldTypes[fieldName]]}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleInputChange}
                    className="form-control"
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
        </div>
    );
}


export default EditTransactionForm;