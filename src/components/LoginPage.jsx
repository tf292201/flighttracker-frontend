import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import ApiHelper from '../utils/api'; // Import the ApiHelper

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Call the login function from ApiHelper
      const token = await ApiHelper.login(username, password);

      // Handle successful login, e.g., store the token in local storage
      onLogin(username);
      localStorage.setItem('token', token);
      console.log('Login successful! Token:', token);
      
      // Redirect to a different page upon successful login
      navigate(`/user/${username}`);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p={3} boxShadow={3} borderRadius={5}>
        <Typography variant="h5" align="center">Login</Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <Box mt={2} mb={1}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button fullWidth type="submit" variant="contained" color="primary">Login</Button>
        </form>
      </Box>
    </Box>
  );
}

export default LoginPage;
