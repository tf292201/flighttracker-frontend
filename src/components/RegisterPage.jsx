import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import ApiHelper from '../utils/api';



function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const token = await ApiHelper.register(username, password, email);
      localStorage.setItem('token', token);
      console.log('Registration successful! Token:', token);
      navigate('/user/:id');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p={3} boxShadow={3} borderRadius={5}>
        <Typography variant="h5" align="center">Register</Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
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
          <Box mb={2}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Button fullWidth type="submit" variant="contained" color="primary">Register</Button>
        </form>
      </Box>
    </Box>
  );
}

export default RegisterPage;
