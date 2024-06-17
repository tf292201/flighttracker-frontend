import axios from 'axios';

const BASE_URL = 'https://flighttracker-backend-6aec.onrender.com'; // Set your base URL here

//change to https://flighttracker-backend-6aec.onrender.com for deployment

const ApiHelper = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, {
        username: username,
        password: password
      });
      const token = response.data.token;
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please try again.');
    }
  },
  
  register: async (username, password, email) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/register`, {
        username: username,
        password: password,
        email: email
      });
      const token = response.data.token;
      // Return the token upon successful registration
      return token;
    } catch (error) {
      console.error('Registration failed:', error);
      // Throw an error to handle registration failure in the component
      throw new Error('Registration failed. Please try again.');
    }
  },

  getUserDataAndFlights: async (userId, token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(`${BASE_URL}/user/${userId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data.');
    }
  },

  fetchAircraftData: async (bounds) => {
    if (!bounds) return; // Don't fetch if bounds are null

    try {
      // Construct query string using bounds
      const queryString = `?lat1=${bounds.south}&lon1=${bounds.west}&lat2=${bounds.north}&lon2=${bounds.east}`;
      const response = await axios.get(`${BASE_URL}/aircraft${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching aircraft data:', error);
      throw new Error('Failed to fetch aircraft data.');
    }
  },

  fetchAircraftDetails: async (icao24) => {
    try {
      const response = await axios.get(`${BASE_URL}/aircraft/focus?icao24=${icao24}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching aircraft details:', error);
      throw new Error('Failed to fetch aircraft details.');
    }
  },
  
  postSpottedAircraft: async (postData, token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.post(`${BASE_URL}/aircraft/spotted`, postData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending POST request:', error);
      throw new Error('Failed to post spotted aircraft.');
    }
  },

  delete: async (callsign, token) => {
    try {
      await axios.delete(`${BASE_URL}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          callsign: callsign
        }
      });} catch (error) {
      console.error('Error deleting flight:', error);
      }
    }
};

export default ApiHelper;
