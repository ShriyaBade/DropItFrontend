// src/components/RouteMap.js
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, OverlayView } from '@react-google-maps/api';

const mapContainerStyle = {
    height: '400px',
    width: '100%',
};

const RouteMap = ({ viewType, driverLocation, pickupLocation, dropoffLocation }) => {
    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        console.log("Driver location:", driverLocation);
    }, [driverLocation]);

    // Fetch and render the route based on viewType
    useEffect(() => {
        if ((viewType === "driver" && driverLocation && pickupLocation && dropoffLocation) ||
            (viewType === "user" && pickupLocation && dropoffLocation)) {
            
            const directionsService = new window.google.maps.DirectionsService();
            
            const routeRequest = {
                origin: viewType === "driver" ? driverLocation : pickupLocation,
                waypoints: viewType === "driver" ? [{ location: pickupLocation }] : [],
                destination: dropoffLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(routeRequest, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error("Error fetching directions:", result);
                }
            });
        }
    }, [viewType, driverLocation, pickupLocation, dropoffLocation]);

    // Custom Marker Component
    const CustomMarker = ({ position, label, color }) => (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div
                style = {{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: color, // Dynamically set background color based on marker type
                    color: 'white',
                    fontSize: '14px',
                    padding: '8px 15px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    transform: 'translate(-50%, -100%)',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                    border: '2px solid white',
                    whiteSpace: 'nowrap',
                }}
                
            >
                {label}
            </div>
        </OverlayView>
    );

    return (
        <GoogleMap
            ref={mapRef}
            mapContainerStyle={mapContainerStyle}
            center={driverLocation || pickupLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={12}
        >
            {/* Render route directions */}
            {directions && <DirectionsRenderer directions={directions} />}

            {/* Driver's location custom marker */}
            {driverLocation && (
                <CustomMarker
                    position={driverLocation}
                    label="D"
                    color="blue"
                />
            )}
        </GoogleMap>
    );
};

export default RouteMap;
