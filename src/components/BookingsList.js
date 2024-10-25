// src/components/BookingsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardActions, Button, Grid, Modal } from '@mui/material';
import RouteMap from './RouteMap';

const BookingsList = ({ bookings, setBookings }) => {
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/bookings`);
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [setBookings]);

    const openBookingModal = (booking) => {
        setSelectedBooking(booking);
    };

    const closeBookingModal = () => {
        setSelectedBooking(null);
    };

    if (loading) {
        return <p>Loading your bookings...</p>;
    }

    if (bookings.length === 0) {
        return <p>No bookings found.</p>;
    }

    return (
        <Box>
            <Grid container spacing={3}>
                {bookings.map((booking) => (
                    <Grid item xs={12} sm={6} key={booking._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Booking ID: {booking._id}</Typography>
                                <Typography>Pickup: {booking.pickupAddress}</Typography>
                                <Typography>Dropoff: {booking.dropoffAddress}</Typography>
                                <Typography>Status: {booking.status}</Typography>
                                <Typography>Estimated Cost: ₹{booking.estimatedCost}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => openBookingModal(booking)} color="primary" variant="contained">
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modal for Booking Details */}
            {selectedBooking && (
                <Modal
                    open={!!selectedBooking}
                    onClose={closeBookingModal}
                >
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '90%', maxWidth: 600, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2
                    }}>
                        <Typography variant="h5" gutterBottom>Booking Details</Typography>
                        <Typography><strong>Pickup:</strong> {selectedBooking.pickupAddress}</Typography>
                        <Typography><strong>Dropoff:</strong> {selectedBooking.dropoffAddress}</Typography>
                        <Typography><strong>Status:</strong> {selectedBooking.status}</Typography>
                        <Typography><strong>Estimated Cost:</strong> ₹{selectedBooking.estimatedCost}</Typography>
                        {selectedBooking.driver && (
                            <Typography><strong>Driver:</strong> {selectedBooking.driver.name}</Typography>
                        )}

                        {/* Map to show route */}
                        <Box mt={2}>
                            <RouteMap
                                viewType="user"
                                driverLocation={selectedBooking.driver ? selectedBooking.driver.location : null}
                                pickupLocation={selectedBooking.pickupLocation}
                                dropoffLocation={selectedBooking.dropoffLocation}
                            />
                        </Box>
                        <Button onClick={closeBookingModal} sx={{ marginTop: 2 }} variant="contained" color="secondary">
                            Close
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
};

export default BookingsList;
