import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../components/AlertMessage';
import Loader from '../components/Loader';
import { registerUser } from '../features/authSlice'
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {
    const { loading, userInfo, error, success } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        
        if (success) navigate('/login') // redirects user to login page if registration was successful

        if (userInfo) navigate('/') // if user is logged in, redirect to dashboard

    }, [navigate, userInfo, success])

    const submitForm = (data) => {

        // check if passwords match when registering 
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match')
        }

        data.email = data.email.toLowerCase(); 
        dispatch(registerUser(data));
    }
    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            {error && <AlertMessage type='danger' message={error} />}

            <div className="text-center mt-3">
                <h2>Sign Up<span role="img" aria-label="Lock">✍</span></h2>
            </div>
            
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type='Name' 
                    {...register('name')}
                    required 
                />
            </Form.Group>

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

            <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                type='password'
                {...register('confirmPassword')}
                required
                />
            </Form.Group>

            <Form.Group className='mt-3 mb-3'>
                <Button type='submit' variant='outline-light' size='sm' className='button' disabled={loading} style={{marginLeft: '0px'}}>
                    {loading ? <Loader /> : 'Sign up 😎' }
                </Button>
            </Form.Group>


        </Form>
    ) 
}

export default RegisterScreen