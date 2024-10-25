// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import HomePage from './components/HomePage';
import UserDashboard from './components/UserDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import { LoadScript } from '@react-google-maps/api';
const libraries = ['places'];

const App = () => {
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <Router>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" component={Link} to="/" sx={{ color: '#fff', textDecoration: 'none', flexGrow: 1 }}>
                        Drop It
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 3 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/driver-dashboard" element={<DriverDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Routes>
            </Box>
        </Router>
        </LoadScript>
    );
};

export default App;
