// src/components/HomePage.js
import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 8 }}>
            <Typography variant="h3" gutterBottom>
                Welcome to the Logistics Platform
            </Typography>
            <Typography variant="subtitle1" paragraph>
                Choose your dashboard to get started:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                <Button
                    component={Link}
                    to="/user-dashboard"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    User Dashboard
                </Button>
                <Button
                    component={Link}
                    to="/driver-dashboard"
                    variant="contained"
                    color="secondary"
                    size="large"
                >
                    Driver Dashboard
                </Button>
                <Button
                    component={Link}
                    to="/admin-dashboard"
                    variant="contained"
                    color="success"
                    size="large"
                >
                    Admin Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;
