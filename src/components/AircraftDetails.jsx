import React, { useState, useEffect }from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ApiHelper from '../utils/api';
import './AircraftDetails.css';
import sunglasses from '../assets/sunglasses.png';


function AircraftDetails({ icao24, onClose }) {
  const [aircraftDetails, setAircraftDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const details = await ApiHelper.fetchAircraftDetails(icao24);
        setAircraftDetails(details);
      } catch (error) {
        console.error('Error fetching aircraft details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [icao24]);


  const handleSpotted = async () => {
    try {
      const { callsign, origin_country, geo_altitude, velocity } = aircraftDetails.combinedResult.aircraftState[0];
      const postData = {
        callsign,
        origin_country,
        geo_altitude,
        velocity,
        manName: aircraftDetails.combinedResult.manName,
        manNum: aircraftDetails.combinedResult.manNum,
        manYear: aircraftDetails.combinedResult.manYear,
        modelNum: aircraftDetails.combinedResult.modelNum,
        photographer: aircraftDetails.combinedResult.photographer,
        regName: aircraftDetails.combinedResult.regName,
        tailNum: aircraftDetails.combinedResult.tailNum,
        thumbnailSrc: aircraftDetails.combinedResult.thumbnailSrc
      };
      const token = localStorage.getItem('token');
      const response = await ApiHelper.postSpottedAircraft(postData, token);
      console.log('POST request successful:', response);
      onClose();
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!aircraftDetails) {
    return <Typography>Error fetching aircraft details</Typography>;
  }

  // Convert altitude from meters to feet
  // Convert velocity from m/s to mph

  const altitudeInFeet = Math.round(aircraftDetails.combinedResult.aircraftState[0].geo_altitude * 3.28084);

  const velocityInMph = Math.round(aircraftDetails.combinedResult.aircraftState[0].velocity * 2.23694);
  
 return (
    <Card className="aircraft-details-card">
      <div className="card-content-container">
        <CardContent className="card-content">
          <Typography variant="h5" gutterBottom>
            Aircraft Details
          </Typography>
          <button onClick={onClose} className="close-button">X</button>
          <Typography variant="body1">
            <strong>Call Sign:</strong> {aircraftDetails.combinedResult.aircraftState[0].callsign}
          </Typography>
          <Typography variant="body1">
            <strong>Origin Country:</strong> {aircraftDetails.combinedResult.aircraftState[0].origin_country}
          </Typography>
          <Typography variant="body1">
            <strong>Manufacturer Name:</strong> {aircraftDetails.combinedResult.manName}
          </Typography>
          <Typography variant="body1">
            <strong>Manufacturer Year:</strong> {aircraftDetails.combinedResult.manYear}
          </Typography>
          <Typography variant="body1">
            <strong>Model Number:</strong> {aircraftDetails.combinedResult.modelNum}
          </Typography>
          <Typography variant="body1">
            <strong>Tail Number:</strong> {aircraftDetails.combinedResult.tailNum}
          </Typography>
          <Typography variant="body1">
            <strong>Origin Country:</strong> {aircraftDetails.combinedResult.aircraftState[0].origin_country}
          </Typography>
          <Typography variant="body1">
            <strong>GPS Altitude (meters):</strong> {aircraftDetails.combinedResult.aircraftState[0].geo_altitude}
          </Typography>
          <Typography variant="body1">
            <strong>GPS Altitude (feet):</strong> {altitudeInFeet}
          </Typography>
          <Typography variant="body1">
            <strong>Velocity(m/s):</strong> {aircraftDetails.combinedResult.aircraftState[0].velocity}
          </Typography>
          <Typography variant="body1">
            <strong>Velocity(mph):</strong> {velocityInMph}
          </Typography>

          <Button onClick={handleSpotted} variant="contained" color="primary">Spotted</Button>
        </CardContent>
        <CardMedia
          component="img"
          src={aircraftDetails.combinedResult.thumbnailSrc ? aircraftDetails.combinedResult.thumbnailSrc : sunglasses}
          alt="Aircraft Image Not Available"
          className="card-media"
        />
      </div>
    </Card>
  );
}

export default AircraftDetails;
