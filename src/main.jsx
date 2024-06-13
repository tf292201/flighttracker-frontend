import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

// Render the React app using ReactDOM.render (legacy approach)
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* Render the App component */}
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
