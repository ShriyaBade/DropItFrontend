// src/components/MapComponent.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const MapComponent = ({ pickupLocation, dropoffLocation, calculateEstimate }) => {
    const [directions, setDirections] = useState(null);

    useEffect(() => {
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
                        const dist = result.routes[0].legs[0].distance.value / 1000; // Convert to km
                        calculateEstimate(dist);
                    } else {
                        console.error("Error fetching directions", result);
                    }
                }
            );
        }
    }, [pickupLocation, dropoffLocation]);

    return (
        <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={pickupLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={10}
        >
            {pickupLocation && <Marker position={pickupLocation} />}
            {dropoffLocation && <Marker position={dropoffLocation} />}
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    );
};

export default MapComponent;
