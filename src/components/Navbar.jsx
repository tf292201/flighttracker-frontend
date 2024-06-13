import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Navbar.css';

function Navbar({ isLoggedIn, username, onLogout, navigate }) {
  
  return (
    <AppBar position="sticky" className='navbar'>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1,  }}>
          {isLoggedIn ? `${username}` : 'Flight Tracker'}
        </Typography>
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to={`/user/${username}`}>
              Profile
            </Button>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
            <Button color="inherit" component={Link} to="/">
              Map
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/">
              Map
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
