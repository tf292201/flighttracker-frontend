import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Navbar.css';


// Navbar component that displays the navigation links dynamically based on the user's authentication status
// The component receives the following props:
// - isLoggedIn: a boolean value that indicates whether the user is authenticated
// - username: a string value that represents the username of the authenticated user
// - onLogout: a function that handles the user logout action

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
