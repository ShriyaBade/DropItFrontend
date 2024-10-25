// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Card, CardContent, Stack, TextField, Button } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [bookingStats, setBookingStats] = useState(null);
    const [driverStats, setDriverStats] = useState(null);
    const [bookingTrends, setBookingTrends] = useState(null);
    const [revenueStats, setRevenueStats] = useState(null);
    const [averageRevenue, setAverageRevenue] = useState(0);
    const [topRoutes, setTopRoutes] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/booking-stats`);
                setBookingStats(bookingResponse.data);

                const driverResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/driver-stats`);
                setDriverStats(driverResponse.data);

                const trendsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/booking-trends`);
                setBookingTrends(trendsResponse.data);

                const revenueResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/revenue-stats`);
                setRevenueStats(revenueResponse.data);

                const avgRevenueResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/average-revenue`);
                setAverageRevenue(avgRevenueResponse.data.avgRevenue);

                const topRoutesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/top-routes`);
                setTopRoutes(topRoutesResponse.data);

                if (startDate && endDate) {
                    const totalEarningsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/total-earnings`, {
                        params: { startDate, endDate }
                    });
                    setTotalEarnings(totalEarningsResponse.data.totalAmount);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {bookingStats && (
                    <Card sx={{ flex: 1, minWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Bookings by Status
                            </Typography>
                            <Pie
                                data={{
                                    labels: bookingStats.statuses.map(stat => stat.status),
                                    datasets: [{
                                        data: bookingStats.statuses.map(stat => stat.count),
                                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: 'bottom' } }
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                {driverStats && (
                    <Card sx={{ flex: 1, minWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Driver Activity
                            </Typography>
                            <Bar
                                data={{
                                    labels: ['Available', 'Busy'],
                                    datasets: [{
                                        label: 'Drivers',
                                        data: [driverStats.available, driverStats.busy],
                                        backgroundColor: ['#4CAF50', '#FF5722'],
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    scales: { y: { beginAtZero: true } },
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                <Card sx={{ flex: 1, minWidth: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Average Revenue per Booking
                        </Typography>
                        <Typography variant="h5" color="primary">
                            ₹{averageRevenue.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 4 }}>
                {bookingTrends && (
                    <Card sx={{ flex: 1, minWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Booking Trends
                            </Typography>
                            <Line
                                data={{
                                    labels: bookingTrends.dates,
                                    datasets: [{
                                        label: 'Bookings',
                                        data: bookingTrends.counts,
                                        borderColor: '#42A5F5',
                                        fill: true,
                                        backgroundColor: 'rgba(66,165,245,0.2)',
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: 'bottom' } }
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                {revenueStats && (
                    <Card sx={{ flex: 1, minWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Revenue Insights
                            </Typography>
                            <Line
                                data={{
                                    labels: revenueStats.dates,
                                    datasets: [{
                                        label: 'Revenue (₹)',
                                        data: revenueStats.amounts,
                                        borderColor: '#FF7043',
                                        fill: true,
                                        backgroundColor: 'rgba(255,112,67,0.2)',
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: 'bottom' } }
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                <Card sx={{ flex: 1, minWidth: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Top Routes by Booking Volume
                        </Typography>
                        <ul>
                            {topRoutes.map((route, index) => (
                                <li key={index}>
                                    <Typography>{route._id.pickup} → {route._id.dropoff}: {route.count} bookings</Typography>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1, minWidth: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total Earnings (Selected Date Range)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 2 }}>
                            <TextField
                                type="date"
                                label="Start Date"
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <Typography variant="h5" color="primary">
                            ₹{totalEarnings.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default AdminDashboard;
