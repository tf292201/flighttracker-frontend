import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Add the Google Maps script dynamically
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (apiKey) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
} else {
  console.error('Google Maps API key is missing. Please check your .env file.');
}

const rootElement = document.getElementById('root');

// Render the React app
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* Render the App component */}
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
