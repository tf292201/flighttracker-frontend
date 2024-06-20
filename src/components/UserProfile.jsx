import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import ApiHelper from '../utils/api';
import sunglasses from '../assets/sunglasses.png';

const UserProfile = () => {
  const { id } = useParams(); // Extract the user ID from the route parameter

  const [userData, setUserData] = useState(null); // State to store user data

  const [flights, setFlights] = useState(null); // State to store aircraft data


  // Fetch user data and flights data when the component mounts
  // Use the user ID from the route parameter to fetch the data
  // Update the state with the fetched data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await ApiHelper.getUserDataAndFlights(id, token);
        setUserData(data.user);
        setFlights(data.flights); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [id]); // Fetch data when the component mounts and when the user ID changes
  


  // Function to handle deleting a flight
  // Make an API request to delete the flight using the callsign
  // Update the flights state by filtering out the deleted flight
  const handleDelete = async (callsign) => {
    try {
      const token = localStorage.getItem('token');
      await ApiHelper.deleteAircraft(callsign, token);
      setFlights(flights.filter(flight => flight.callsign !== callsign));
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };


  return (
    <div>
      <Box sx={{ paddingTop: '50px' }}>
      <TableContainer component={Paper} sx={{ overflowX: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.4)', fontFamily: 'Roboto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              {/* Add more table headers as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData && (
              <TableRow>
                <TableCell>{userData.username}</TableCell> {/* Render user's name */}
                <TableCell>{userData.email}</TableCell> {/* Render user's email */}
                {/* Render more user data as needed */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
      <Box sx={{ paddingTop: '20px' }}>
      <TableContainer component={Paper} sx={{ overflowX: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flight Callsign</TableCell>
              <TableCell>Origin Country</TableCell>
              <TableCell>Manufacturer Name</TableCell>
              <TableCell>Manufacturer Year</TableCell>
              <TableCell>Model Number</TableCell>
              <TableCell>Registration Name</TableCell>
              <TableCell>Tail Number</TableCell>
              <TableCell>Photographer</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights && flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.callsign}</TableCell> {/* Render flight callsign */}
                <TableCell>{flight.origin_country}</TableCell> {/* Render origin country */}
                <TableCell>{flight.man_name}</TableCell> {/* Render manufacturer name */}
                <TableCell>{flight.man_year}</TableCell> {/* Render manufacturer year */}
                <TableCell>{flight.model_num}</TableCell> {/* Render model number */}
                <TableCell>{flight.reg_name}</TableCell> {/* Render registration name */}
                <TableCell>{flight.tail_num}</TableCell> {/* Render tail number */}
                <TableCell>{flight.photographer}</TableCell> {/* Render photographer */}
                <TableCell>
                <img 
    src={flight.thumbnail_src || sunglasses} 
    alt="Aircraft Thumbnail N/A" 
    style={{ width: '100px' }} 
  />
                </TableCell>
                <TableCell>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleDelete(flight.callsign)}
                    >
                      Delete
                    </Button>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </div>
  );};
  

export default UserProfile;
