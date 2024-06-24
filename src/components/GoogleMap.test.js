import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoogleMap from './GoogleMap';
import { act } from 'react-dom/test-utils';

// Mock assets
jest.mock('../assets/up_icon.png', () => 'upIcon');
jest.mock('../assets/up_right_icon.png', () => 'upRightIcon');
jest.mock('../assets/right_icon.png', () => 'rightIcon');
jest.mock('../assets/down_right_icon.png', () => 'downRightIcon');
jest.mock('../assets/down_icon.png', () => 'downIcon');
jest.mock('../assets/down_left_icon.png', () => 'downLeftIcon');
jest.mock('../assets/left_icon.png', () => 'leftIcon');
jest.mock('../assets/up_left_icon.png', () => 'upLeftIcon');
jest.mock('../assets/mapStyle', () => []);

// Mock components
jest.mock('@mui/material/SwipeableDrawer', () => (props) => <div>{props.children}</div>);
jest.mock('./AircraftDetails', () => () => <div>Aircraft Details</div>);

describe('GoogleMap Component', () => {
  beforeEach(() => {
    // Mock Google Maps API
    const google = {
      maps: {
        Map: jest.fn().mockImplementation(() => ({
          addListener: jest.fn(),
          getBounds: jest.fn().mockReturnValue({
            getSouthWest: jest.fn().mockReturnValue({ lat: () => 0, lng: () => 0 }),
            getNorthEast: jest.fn().mockReturnValue({ lat: () => 1, lng: () => 1 }),
          }),
        })),
        Marker: jest.fn().mockImplementation(() => ({
          addListener: jest.fn(),
          setMap: jest.fn(),
        })),
        Size: jest.fn().mockImplementation(() => ({})),
      },
    };
    global.window.google = google;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders GoogleMap component without crashing', () => {
    render(<GoogleMap onBoundsChange={jest.fn()} aircraftData={[]} />);
    expect(screen.getByRole('map')).toBeInTheDocument();
  });

  test('initializes Google map', async () => {
    const { container } = render(<GoogleMap onBoundsChange={jest.fn()} aircraftData={[]} />);
    await waitFor(() => expect(global.window.google.maps.Map).toHaveBeenCalled());
    expect(container.querySelector('.map-container')).toBeInTheDocument();
  });

  test('renders markers on map when aircraftData is provided', async () => {
    const mockAircraftData = [
      { icao24: 'abc123', callsign: 'TEST123', latitude: 34.0522, longitude: -118.2437, true_track: 90 },
    ];
    render(<GoogleMap onBoundsChange={jest.fn()} aircraftData={mockAircraftData} />);

    await waitFor(() => {
      expect(global.window.google.maps.Marker).toHaveBeenCalledWith(expect.objectContaining({
        position: { lat: 34.0522, lng: -118.2437 },
        title: 'TEST123',
        icon: expect.objectContaining({
          url: 'rightIcon',
        }),
      }));
    });
  });

  test('opens AircraftDetails when marker is clicked', async () => {
    const mockAircraftData = [
      { icao24: 'abc123', callsign: 'TEST123', latitude: 34.0522, longitude: -118.2437, true_track: 90 },
    ];
    render(<GoogleMap onBoundsChange={jest.fn()} aircraftData={mockAircraftData} />);

    await waitFor(() => expect(global.window.google.maps.Marker).toHaveBeenCalled());

    act(() => {
      global.window.google.maps.Marker.mock.calls[0][0].addListener.mock.calls[0][1](); // Trigger click event
    });

    expect(screen.getByText('Aircraft Details')).toBeInTheDocument();
  });
});
