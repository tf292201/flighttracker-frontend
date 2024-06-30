import React, { useEffect, useRef, useState } from 'react';
import './GoogleMap.css'; 

// Import custom map icons
import upIcon from '../assets/up_icon.png'; 
import upRightIcon from '../assets/up_right_icon.png'; 
import rightIcon from '../assets/right_icon.png'; 
import downRightIcon from '../assets/down_right_icon.png'; 
import downIcon from '../assets/down_icon.png'; 
import downLeftIcon from '../assets/down_left_icon.png'; 
import leftIcon from '../assets/left_icon.png';
import upLeftIcon from '../assets/up_left_icon.png'; 

// Import custom map style
import mapStyle from '../assets/mapStyle'; 
import darkStyle from '../assets/darkStyle';

// Import Time Utility
import TimeUtility from '../utils/DarkMode';



import SwipeableDrawer from '@mui/material/SwipeableDrawer'


import AircraftDetails from './AircraftDetails'; // Import AircraftDetails component



// GoogleMap component
// initializes then calls handleBoundsChange when map becomes idle
// fetches aircraftData when initialized and when map becomes idle after a drag or zoom event
// renders markers on the map based on aircraftData
// clears markers when aircraftData changes
// adds event listeners to markers to fetch aircraft focus data
// renders markers with different icons based on trueTrack value

function GoogleMap({ onBoundsChange, aircraftData }) {
  const mapRef = useRef(null);
  const [initialized, setInitialized] = useState(false); // State to store initialization status
  const [map, setMap] = useState(null); // State to store the map instance
  const [markers, setMarkers] = useState([]); // State to store current markers
  const [selectedAircraft, setSelectedAircraft] = useState(null); // State to store selected aircraft
  
  const fetchAircraftFocus = (icao24) => {
    setSelectedAircraft(icao24);
  };
  

  useEffect(() => {
    if (!mapRef.current) return;

    // Check if the map is already initialized
    if (!initialized) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newMap = new window.google.maps.Map(mapRef.current, {
              center: { lat: latitude, lng: longitude },
              zoom: 10,
              styles: TimeUtility.isNightTime() ? darkStyle : mapStyle,
            });

            // Add event listener for bounds change
            newMap.addListener('idle', () => handleBoundsChange(newMap));


            setMap(newMap); // Set the map instance
            setInitialized(true); // Set the initialized flag to true
          },
          (error) => {
            console.error('Error getting current position:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by your browser');
      }
    }
  }, [initialized]);

  useEffect(() => {
    if (!map) return;
  
    const intervalId = setInterval(() => {
      const newStyle = isNightTime() ? darkMapStyle : lightMapStyle;
      map.setOptions({ styles: newStyle });
    }, 60000); // Check every minute
  
    return () => clearInterval(intervalId);
  }, [map]);


  // Add interval to handle bounds change and fetch aircraft data
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (map) {
        handleBoundsChange(map);
      }
    }, 10000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [map]);
  
// Clear markers and render new markers when aircraftData changes
// If a new aircraft is added, a new marker will be created.
// This handles the event of creating a new marker when an aircraft flies into the bounds.
  useEffect(() => {
    if (initialized && map && aircraftData && aircraftData.length > 0) {
      clearMarkers(); 
      renderAircraftMarkers();
    }
  }, [aircraftData, initialized, map]);


// Remove all markers from the map and clear the markers array.
// Keeps markers from accumulating on the map when aircraftData changes, or bounds change.
  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.setMap(null); 
    });
    setMarkers([]);
  };

  // Create a new marker for each aircraft and add it to the map
  // information such as latitude and longitude dictate the markers position on the map.
  // trueTrack dictates the direction the icon will point.
  // Call sign is the title of the marker.
  const renderAircraftMarkers = () => {
    const newMarkers = aircraftData.map(aircraft => {
      const { icao24, callsign, latitude, longitude, true_track } = aircraft;
      const position = { lat: latitude, lng: longitude };
      return createMarker(position, icao24, callsign, true_track);
    });
    setMarkers(newMarkers); // Set the new markers
  };

  // Create a new marker on the map
  const createMarker = (position, icao24, callsign, trueTrack) => {
    if (!map) {
      console.error('Map not initialized yet');
      return null;
    }
  
    
  
    // Determine the icon URL based on the trueTrack value
    // The icon will point in the direction of the trueTrack value
    // Eight possible directions: Up, Up-Right, Right, Down-Right, Down, Down-Left, Left, Up-Left

    let iconUrl = ''; 


    if (trueTrack >= 338 || trueTrack < 23) {
      iconUrl = upIcon; // Up
    } else if (trueTrack >= 23 && trueTrack < 68) {
      iconUrl = upRightIcon; // Up-Right
    } else if (trueTrack >= 68 && trueTrack < 113) {
      iconUrl = rightIcon; // Right
    } else if (trueTrack >= 113 && trueTrack < 158) {
      iconUrl = downRightIcon // Down-Right
    } else if (trueTrack >= 158 && trueTrack < 203) {
      iconUrl = downIcon; // Down
    } else if (trueTrack >= 203 && trueTrack < 248) {
      iconUrl = downLeftIcon; // Down-Left
    } else if (trueTrack >= 248 && trueTrack < 293) {
      iconUrl = leftIcon; // Left
    } else if (trueTrack >= 293 && trueTrack < 338) {
      iconUrl = upLeftIcon; // Up-Left
    }
  
    // Create a new marker on the map
    // use the icon URL based on the trueTrack value
    // Add a click event listener to the marker to fetch aircraft focus data
    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: callsign,
      icon: {
        url: iconUrl, 
        scaledSize: new window.google.maps.Size(30, 30),
      },
      icao24: icao24,
    });
    marker.addListener('click', () => {
      fetchAircraftFocus(icao24);
    });
    return marker;
  };

  // Handle bounds change event
  // This function gets the new bounds and updates the bounds state

  const handleBoundsChange = (map) => {
    const bounds = map.getBounds();
    if (bounds) {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const boundsObject = {
        south: sw.lat(),
        west: sw.lng(),
        north: ne.lat(),
        east: ne.lng(),
      };

      // Skip if bounds are invalid
      // Used to avoid bug with Google Maps API where lat and long of bounding box are the same
      if (ne.lat() === sw.lat() || ne.lng() === sw.lng()) {
        return;
      } 


      onBoundsChange(boundsObject); // Communicate bounds change to parent component
    }
  };

  const handleCloseAircraftDetails = () => {
    setSelectedAircraft(null);
  };
  return (
    <>
      <div ref={mapRef} className="map-container"></div>
      <SwipeableDrawer
        anchor="bottom"
        open={!!selectedAircraft}
        onClose={handleCloseAircraftDetails}
        onOpen={() => {}}
        swipeAreaWidth={20}
        disableSwipeToOpen={false}
      >
        <div className="drawer-content">
          {selectedAircraft && (
            <AircraftDetails
              icao24={selectedAircraft}
              onClose={handleCloseAircraftDetails}
            />
          )}
        </div>
      </SwipeableDrawer>
    </>
  );
}

export default GoogleMap;
