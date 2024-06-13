import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import AircraftInfo from './components/AircraftInfo'; 
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import LogOut from './components/LogOut';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
      } else {
        setUsername(decodedToken.username);
        setIsLoggedIn(true);
      }
    }
  }, []); // Empty dependency array ensures the effect runs only once on component mount
  
  const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} navigate={navigate}/>
      <Routes>
        <Route path="/" element={<AircraftInfo />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/welcome" element={<h1>Welcome</h1>} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/logout" element={<LogOut onLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

export default App;
