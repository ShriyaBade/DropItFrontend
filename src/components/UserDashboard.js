// src/components/UserDashboard.js
import React, { useState } from 'react';
import { Container, Typography, Button, Modal, Box } from '@mui/material';
import BookingForm from './BookingForm';
import BookingsList from './BookingsList';

const UserDashboard = () => {
    const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
    const [bookings, setBookings] = useState([]);

    const handleBookingCreated = (newBooking) => {
        setBookings([newBooking, ...bookings]);
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>User Dashboard</Typography>

            {/* Button to open Booking Form */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsBookingFormOpen(true)}
                sx={{ marginBottom: 3 }}
            >
                Create New Booking
            </Button>

            {/* Bookings List Component */}
            <BookingsList bookings={bookings} setBookings={setBookings} />

            {/* Modal for Booking Form */}
            <Modal
                open={isBookingFormOpen}
                onClose={() => setIsBookingFormOpen(false)}
            >
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2
                }}>
                    <BookingForm onClose={() => setIsBookingFormOpen(false)} onBookingCreated={handleBookingCreated} />
                </Box>
            </Modal>
        </Container>
    );
};

export default UserDashboard;
