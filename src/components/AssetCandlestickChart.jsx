import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Box, Typography, CircularProgress } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

const AssetLineChart = ({ data, symbol, loading }) => {
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) return null;

        return {
            datasets: [
                {
                    label: `${symbol} Close Price`,
                    data: data.map(d => ({ x: new Date(d.date), y: d.close })),
                    borderColor: '#00e676',
                    backgroundColor: 'rgba(0, 230, 118, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2,
                }
            ],
        };
    }, [data, symbol]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(16, 32, 48, 0.9)',
                titleColor: '#fff',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: 'month' },
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.5)' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: 'rgba(255, 255, 255, 0.5)' }
            }
        },
    };

    if (loading) {
        return (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', width: '100%', pt: 2 }}>
            {chartData ? <Line options={options} data={chartData} /> : <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>No data available</Typography>}
        </Box>
    );
};

export default AssetLineChart;
