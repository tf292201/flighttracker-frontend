import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AircraftDetails from './AircraftDetails';
import ApiHelper from '../utils/api';

jest.mock('../utils/api');

describe('AircraftDetails', () => {
  const mockDetails = {
    combinedResult: {
      aircraftState: [
        {
          callsign: 'ABC123',
          origin_country: 'USA',
          geo_altitude: 10000,
          velocity: 250,
        },
      ],
      manName: 'Boeing',
      manNum: '737',
      manYear: 2015,
      modelNum: '800',
      photographer: 'John Doe',
      regName: 'N12345',
      tailNum: '12345',
      thumbnailSrc: null,
    },
  };

  beforeEach(() => {
    ApiHelper.fetchAircraftDetails.mockResolvedValue(mockDetails);
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('fetches and displays aircraft details', async () => {
    render(<AircraftDetails icao24="abc123" onClose={() => {}} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(ApiHelper.fetchAircraftDetails).toHaveBeenCalledWith('abc123'));

    expect(screen.getByText('Aircraft Details')).toBeInTheDocument();
    expect(screen.getByText('Call Sign: ABC123')).toBeInTheDocument();
    expect(screen.getByText('Origin Country: USA')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer Name: Boeing')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer Year: 2015')).toBeInTheDocument();
    expect(screen.getByText('Model Number: 800')).toBeInTheDocument();
    expect(screen.getByText('Tail Number: 12345')).toBeInTheDocument();
    expect(screen.getByText('GPS Altitude (meters): 10000')).toBeInTheDocument();
    expect(screen.getByText('GPS Altitude (feet): 32808')).toBeInTheDocument();
    expect(screen.getByText('Velocity(m/s): 250')).toBeInTheDocument();
    expect(screen.getByText('Velocity(mph): 559')).toBeInTheDocument();
  });

  it('displays error message when fetching details fails', async () => {
    ApiHelper.fetchAircraftDetails.mockRejectedValue(new Error('Failed to fetch'));

    render(<AircraftDetails icao24="abc123" onClose={() => {}} />);

    await waitFor(() => expect(ApiHelper.fetchAircraftDetails).toHaveBeenCalledWith('abc123'));

    expect(screen.getByText('Error fetching aircraft details')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = jest.fn();
    render(<AircraftDetails icao24="abc123" onClose={onClose} />);

    await waitFor(() => expect(ApiHelper.fetchAircraftDetails).toHaveBeenCalledWith('abc123'));

    userEvent.click(screen.getByText('X'));
    expect(onClose).toHaveBeenCalled();
  });

  it('sends a POST request when Spotted button is clicked', async () => {
    ApiHelper.postSpottedAircraft.mockResolvedValue({ success: true });

    render(<AircraftDetails icao24="abc123" onClose={() => {}} />);

    await waitFor(() => expect(ApiHelper.fetchAircraftDetails).toHaveBeenCalledWith('abc123'));

    userEvent.click(screen.getByText('Spotted'));

    await waitFor(() => expect(ApiHelper.postSpottedAircraft).toHaveBeenCalledWith(expect.any(Object), 'fake-token'));
  });
});
