import React, { useState } from 'react';
import GoogleMap from './GoogleMap'; 
import axios from 'axios';
import ApiHelper from '../utils/api';
import './AircraftInfo.css'; // Import custom CSS styles

function AircraftInfo() {
  const [aircraftData, setAircraftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null); // State to store bounds
  //



  // Function to handle bounds change
  const handleBoundsChange = (newBounds) => {
    setBounds(newBounds);
    console.log('Bounds:', newBounds);
    // Fetch aircraft data using the new bounds
    fetchAircraftData(newBounds);
  };

 // Function to fetch aircraft data using bounds
 const fetchAircraftData = async (bounds) => {
  if (!bounds) return; // Don't fetch if bounds are null

  try {
    const data = await ApiHelper.fetchAircraftData(bounds);
    console.log('Aircraft data:', data);
    setAircraftData(data.aircraft); // Adjust this based on your backend response structure
    setLoading(false);
  } catch (error) {
    console.error('Error fetching aircraft data:', error);
    setLoading(false);
  }
};
  

  return (
    <div className='aircraft-info-container'>
      <h2>Sky Tracker</h2>
      <GoogleMap  onBoundsChange={handleBoundsChange} aircraftData={aircraftData} />
      {/* Display aircraft information */}
    </div>
  );
}

export default AircraftInfo;
