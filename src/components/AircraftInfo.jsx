import React, { useState } from 'react';
import GoogleMap from './GoogleMap'; 
import ApiHelper from '../utils/api';
import './AircraftInfo.css'; 

function AircraftInfo() {
  const [aircraftData, setAircraftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null); // State to store bounds
  //



  // Function to handle bounds change
  // When a user moves or zones in/out of the map, the bounds will change
  // This function will be called when the bounds of the map change
  // It will receive the new bounds as an argument and fetch aircraft data using the new bounds

  const handleBoundsChange = (newBounds) => {
    setBounds(newBounds);
    console.log('Bounds:', newBounds);
    // Fetch aircraft data using the new bounds
    fetchAircraftData(newBounds);
  };

 // Function to fetch aircraft data using bounds
 // Make an API request to fetch aircraft data using the bounds
 // Update the aircraftData state with the fetched data
 // Set loading state to false when the data is fetched
 const fetchAircraftData = async (bounds) => {
  if (!bounds) return; // Don't fetch if bounds are null

  try {
    const data = await ApiHelper.fetchAircraftData(bounds);
    console.log('Aircraft data:', data);
    setAircraftData(data.aircraft); 
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
     
    </div>
  );
}

export default AircraftInfo;
