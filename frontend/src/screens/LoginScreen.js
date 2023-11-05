import React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AlertMessage from '../components/AlertMessage';
import Loader from '../components/Loader';
import { loginUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const LoginScreen = () => {
  const { register, handleSubmit } = useForm();
  const { loading, userInfo, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (userInfo) {
      navigate('/') // redirects user to dashboard if they are logged in already
    }
  }, [navigate, userInfo])
  

  const navigateToRegister = () => {
    navigate('/register')
  }

  const submitForm = (data) => {
    dispatch(loginUser(data))
  }

  return (

    <Form onSubmit={handleSubmit(submitForm)}>
      {error && <AlertMessage type='danger' message={error} />}

      <div className="text-center mt-3">
        <h2>Login <span role="img" aria-label="Lock">🔒</span></h2>
      </div>
      
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control 
          type='email'
          {...register('email')}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type='password' 
          {...register('password')}
          required
        />
      </Form.Group>

      <Form.Group className="mt-3 mb-3">
        <Button 
          type='submit' 
          variant='outline-light'
          size='sm' 
          disabled={loading} 
          >
          {loading ? <Loader /> : 'Login'}
        </Button>

        <Button 
          onClick={navigateToRegister} 
          variant='outline-light' 
          size='sm' 
          style={{marginLeft: '20px'}}
          >
          Sign up 
        </Button>
      </Form.Group>

    </Form>
    
  )
}

export default LoginScreen