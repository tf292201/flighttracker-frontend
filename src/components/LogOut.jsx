import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogOut() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token from local storage upon component mount (i.e., when user logs out)
    localStorage.removeItem('token');
    // Redirect to the login page or any other appropriate page after logout
    navigate('/');
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
}

export default LogOut;