import React, { useEffect, useRef, useState } from 'react';
import './GoogleMap.css'; // Import custom CSS styles
import upIcon from '../assets/up_icon.png'; // Import plane icon image
import upRightIcon from '../assets/up_right_icon.png'; // Import plane icon image
import rightIcon from '../assets/right_icon.png'; // Import plane icon image
import downRightIcon from '../assets/down_right_icon.png'; // Import plane icon image
import downIcon from '../assets/down_icon.png'; // Import plane icon image
import downLeftIcon from '../assets/down_left_icon.png'; // Import plane icon image
import leftIcon from '../assets/left_icon.png'; // Import plane icon image
import upLeftIcon from '../assets/up_left_icon.png'; // Import plane icon image
import mapStyle from '../assets/mapStyle'; // Import custom map style


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
  const [initialized, setInitialized] = useState(false); // State to store initial bounds
  const [map, setMap] = useState(null); // State to store the map instance
  const [markers, setMarkers] = useState([]); // State to store current markers
  //
  const [selectedAircraft, setSelectedAircraft] = useState(null); // State to store selected aircraft
  // Function to fetch aircraft focus data
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
              styles: mapStyle, // Apply custom map style
            });

            // Add event listeners for map events
            // only need when map becomes idle (no more dragging or zooming)
            // newMap.addListener('dragend', () => handleBoundsChange(newMap));
            // newMap.addListener('zoom_changed', () => handleBoundsChange(newMap));
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
    const intervalId = setInterval(() => {
      if (map) {
        handleBoundsChange(map);
      }
    }, 10000); // Run every 10 seconds
  
    return () => {
      clearInterval(intervalId);
    };
  }, [map]);
  

  useEffect(() => {
    if (initialized && map && aircraftData && aircraftData.length > 0) {
      clearMarkers(); // Clear existing markers
      renderAircraftMarkers(); // Render new markers
    }
  }, [aircraftData, initialized, map]);



  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.setMap(null); // Remove marker from the map
    });
    setMarkers([]); // Clear the markers array
  };

  const renderAircraftMarkers = () => {
    const newMarkers = aircraftData.map(aircraft => {
      const { icao24, callsign, latitude, longitude, true_track } = aircraft;
      const position = { lat: latitude, lng: longitude };
      return createMarker(position, icao24, callsign, true_track);
    });
    setMarkers(newMarkers); // Set the new markers
  };

  const createMarker = (position, icao24, callsign, trueTrack) => {
    if (!map) {
      console.error('Map not initialized yet');
      return null;
    }
  
    let iconUrl = ''; // Initialize the icon URL
  
    // Determine the icon URL based on the trueTrack value
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
  
    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: callsign,
      icon: {
        url: iconUrl, // Use the determined icon URL
        scaledSize: new window.google.maps.Size(30, 30),
      },
      icao24: icao24,
    });
    marker.addListener('click', () => {
      fetchAircraftFocus(icao24);
    });
    return marker;
  };

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
      } // Skip if bounds are invalid


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
