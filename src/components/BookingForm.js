// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Stack, Autocomplete, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const vehicleRates = {
    'Bike': 15, // Rs. per km
    'Car': 40,
    'Truck': 100,
};

const BookingForm = () => {
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [pickupOptions, setPickupOptions] = useState([]);
    const [dropoffOptions, setDropoffOptions] = useState([]);
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropoffAddress, setDropoffAddress] = useState('');
    const [vehicleType, setVehicleType] = useState('Bike');
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [distance, setDistance] = useState(0);
    const [directions, setDirections] = useState(null);

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));

    const fetchPlaceSuggestions = (input, setOptions) => {
        if (input.length < 3) return;
        autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const suggestions = predictions.map((prediction) => ({
                    description: prediction.description,
                    placeId: prediction.place_id,
                }));
                setOptions(suggestions);
            }
        });
    };

    const handlePickupInputChange = (event, newInput) => {
        setPickupAddress(newInput);
        fetchPlaceSuggestions(newInput, setPickupOptions);
    };

    const handleDropoffInputChange = (event, newInput) => {
        setDropoffAddress(newInput);
        fetchPlaceSuggestions(newInput, setDropoffOptions);
    };

    const handlePlaceSelect = (placeId, setLocation) => {
        placesService.getDetails({ placeId }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                const location = place.geometry.location;
                setLocation({
                    lat: location.lat(),
                    lng: location.lng(),
                });
            }
        });
    };

    const calculateEstimate = (vehicleType,dist) => {
        const rate = vehicleRates[vehicleType];
        const cost = dist * rate;
        setEstimatedCost(cost);
        return cost;
    };

    const handleVehicleChange = (event) => {
        setVehicleType(event.target.value);
        calculateEstimate(event.target.value,distance); // Recalculate if distance is already available
    };

    const calculateAndDisplayRoute = () => {
        if (pickupLocation && dropoffLocation) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: pickupLocation,
                    destination: dropoffLocation,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                        const route = result.routes[0];
                        const totalDistance = route.legs[0].distance.value / 1000;
                        setDistance(totalDistance);
                        calculateEstimate(vehicleType,totalDistance);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    };

    useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            calculateAndDisplayRoute();
        }
    }, [pickupLocation, dropoffLocation]);

    const handleBooking = async (e) => {
        e.preventDefault();
        const bookingData = {
            pickupLocation,
            dropoffLocation,
            pickupAddress,
            dropoffAddress,
            vehicleType,
            estimatedCost,
        };
    
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URI}/bookings`, bookingData);
            alert("Booking created successfully!");
        } catch (error) {
            alert("Failed to create booking.");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleBooking}
            sx={{
                p: { xs: 2, md: 4 },
                maxWidth: { xs: '90vw', md: 600 },
                mx: 'auto',
                my: { xs: 1, md: 4 },
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'white',
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Book a Vehicle
            </Typography>

            <Stack spacing={3} mt={2}>
                <FormControl fullWidth>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                        value={vehicleType}
                        onChange={handleVehicleChange}
                        label="Vehicle Type"
                    >
                        <MenuItem value="Bike">Bike</MenuItem>
                        <MenuItem value="Car">Car</MenuItem>
                        <MenuItem value="Truck">Truck</MenuItem>
                    </Select>
                </FormControl>

                <Autocomplete
                    freeSolo
                    options={pickupOptions}
                    getOptionLabel={(option) => option.description || ''}
                    onInputChange={handlePickupInputChange}
                    onChange={(event, value) => handlePlaceSelect(value.placeId, setPickupLocation)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Pickup Location"
                            placeholder="Enter pickup location"
                            variant="outlined"
                            fullWidth
                            value={pickupAddress}
                        />
                    )}
                />

                <Autocomplete
                    freeSolo
                    options={dropoffOptions}
                    getOptionLabel={(option) => option.description || ''}
                    onInputChange={handleDropoffInputChange}
                    onChange={(event, value) => handlePlaceSelect(value.placeId, setDropoffLocation)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Dropoff Location"
                            placeholder="Enter dropoff location"
                            variant="outlined"
                            fullWidth
                            value={dropoffAddress}
                        />
                    )}
                />

                <Typography variant="body1">Distance: {distance.toFixed(2)} km</Typography>
                <Typography variant="body1">Estimated Cost: Rs.{estimatedCost.toFixed(2)}</Typography>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!pickupLocation || !dropoffLocation}
                    sx={{ py: 1.5, fontSize: '1rem' }}
                >
                    Confirm Booking
                </Button>
            </Stack>

            <Box mt={4} sx={{ width: '100%', height: '400px' }}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={pickupLocation || { lat: 37.7749, lng: -122.4194 }}
                    zoom={13}
                >
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </Box>
        </Box>
    );
};

export default BookingForm;
