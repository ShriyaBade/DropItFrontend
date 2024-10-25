// src/components/DriverDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Stack, Divider } from '@mui/material';

const DriverDashboard = () => {
    const driverId = "driver1"; // Replace with the actual driver ID from auth/user context if available
    const [availableJobs, setAvailableJobs] = useState([]);
    const [acceptedJobs, setAcceptedJobs] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const availableResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/bookings?status=Pending`);
                setAvailableJobs(availableResponse.data);

                const acceptedResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/bookings?status=Accepted`);
                setAcceptedJobs(acceptedResponse.data);

                const completedResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/driver/${driverId}/completed-jobs`);
                setCompletedJobs(completedResponse.data.completedJobs);
                setTotalEarnings(completedResponse.data.totalEarnings);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, [driverId]);

    const acceptJob = async (jobId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URI}/bookings/${jobId}/assign`, {
                driverLocation: { lat: 37.7749, lng: -122.4194 }
            });
            setAvailableJobs(availableJobs.filter((job) => job._id !== jobId));
            setAcceptedJobs([...acceptedJobs, availableJobs.find((job) => job._id === jobId)]);
            alert("Job accepted successfully!");
        } catch (error) {
            console.error("Failed to accept job:", error.response?.data || error.message);
        }
    };

    const completeJob = async (jobId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URI}/driver/bookings/${jobId}/complete`);
            setAcceptedJobs(acceptedJobs.filter((job) => job._id !== jobId));
            alert("Job marked as completed!");
        } catch (error) {
            console.error("Failed to complete job:", error.response?.data || error.message);
        }
    };

    return (
        <Box maxWidth="lg" mx="auto" mt={8} p={4} borderRadius="lg" boxShadow="md">
            <Typography variant="h4" textAlign="center" mb={4}>
                Driver Dashboard (Total Earnings: ₹{totalEarnings.toFixed(2)})
            </Typography>

            {/* Available Jobs Section */}
            <Typography variant="h6" mt={4}>Available Jobs</Typography>
            <Stack spacing={2} divider={<Divider />}>
                {availableJobs.length === 0 ? (
                    <Typography>No available jobs at the moment.</Typography>
                ) : (
                    availableJobs.map((job) => (
                        <Box key={job._id} p={2} border="1px solid #ddd" borderRadius="4px" bgcolor="background.paper">
                            <Typography variant="body1"><strong>Pickup:</strong> {job.pickupAddress}</Typography>
                            <Typography variant="body1"><strong>Dropoff:</strong> {job.dropoffAddress}</Typography>
                            <Typography variant="body2">Estimated Cost: ₹{job.estimatedCost.toFixed(2)}</Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => acceptJob(job._id)}
                                sx={{ mt: 1 }}
                            >
                                Accept Job
                            </Button>
                        </Box>
                    ))
                )}
            </Stack>

            {/* Accepted Jobs Section */}
            <Typography variant="h6" mt={4}>Accepted Jobs</Typography>
            <Stack spacing={2} divider={<Divider />}>
                {acceptedJobs.length === 0 ? (
                    <Typography>No accepted jobs at the moment.</Typography>
                ) : (
                    acceptedJobs.map((job) => (
                        <Box key={job._id} p={2} border="1px solid #ddd" borderRadius="4px" bgcolor="background.paper">
                            <Typography variant="body1"><strong>Pickup:</strong> {job.pickupAddress}</Typography>
                            <Typography variant="body1"><strong>Dropoff:</strong> {job.dropoffAddress}</Typography>
                            <Typography variant="body2">Estimated Cost: ₹{job.estimatedCost.toFixed(2)}</Typography>
                            <Button
                                href={`https://www.google.com/maps/dir/?api=1&origin=${job.pickupLocation.lat},${job.pickupLocation.lng}&destination=${job.dropoffLocation.lat},${job.dropoffLocation.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="secondary"
                                variant="outlined"
                                sx={{ mt: 1 }}
                            >
                                View Route on Google Maps
                            </Button>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={() => completeJob(job._id)}
                                sx={{ mt: 1, ml: 1 }}
                            >
                                Complete Job
                            </Button>
                        </Box>
                    ))
                )}
            </Stack>

            {/* Completed Jobs Section */}
            <Typography variant="h6" mt={4}>Completed Jobs</Typography>
            <Stack spacing={2} divider={<Divider />}>
                {completedJobs.length === 0 ? (
                    <Typography>No completed jobs at the moment.</Typography>
                ) : (
                    completedJobs.map((job) => (
                        <Box key={job._id} p={2} border="1px solid #ddd" borderRadius="4px" bgcolor="background.paper">
                            <Typography variant="body1"><strong>Pickup:</strong> {job.pickupAddress}</Typography>
                            <Typography variant="body1"><strong>Dropoff:</strong> {job.dropoffAddress}</Typography>
                            <Typography variant="body2">Total Earned: ₹{job.estimatedCost.toFixed(2)}</Typography>
                        </Box>
                    ))
                )}
            </Stack>
        </Box>
    );
};

export default DriverDashboard;
