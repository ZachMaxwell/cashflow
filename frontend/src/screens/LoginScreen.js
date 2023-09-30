import React, { useState } from 'react';
import axios from 'axios';

function LoginScreen() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you can send the formData to your backend for authentication
    // For example, using Axios or the fetch API.
    // Don't forget to handle the response from the server.

    axios.post('/api/login/', {
        username: 'your_username',
        password: 'your_password',
    })
    .then(response => {
        // Handle a successful login here
        console.log('Login response:', response.data);
    })
    .catch(error => {
        // Handle login failure here
        console.error('Login error:', error);
    });

    console.log('Form Data:', formData);
    // Add your authentication logic here.
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or Email:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginScreen;
