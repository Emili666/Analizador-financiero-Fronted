import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PatternBarChart = ({ patterns, loading }) => {
    if (loading) return <Typography>Loading bars...</Typography>;
    if (!patterns) return <Typography color="text.secondary">No data.</Typography>;

    const data = {
        labels: ['Consecutive Up', 'Bullish Engulfing'],
        datasets: [
            {
                label: 'Frequency',
                data: [patterns.consecutiveUp || 0, patterns.bullishEngulfing || 0],
                backgroundColor: [
                    'rgba(0, 230, 118, 0.6)',
                    'rgba(41, 121, 255, 0.6)',
                ],
                borderColor: [
                    '#00e676',
                    '#2979ff',
                ],
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(16, 32, 48, 0.9)',
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: 'rgba(255, 255, 255, 0.5)' }
            }
        }
    };

    return (
        <Box sx={{ height: 200, mt: 2 }}>
            <Bar data={data} options={options} />
        </Box>
    );
};

export default PatternBarChart;
