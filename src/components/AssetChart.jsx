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

const AssetChart = ({ data, symbol, loading }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return null;

        return {
            datasets: [
                {
                    label: `Precio ${symbol}`,
                    data: data.map(d => ({ x: d.date, y: d.close })),
                    borderColor: '#00e676',
                    backgroundColor: 'rgba(0, 230, 118, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    label: 'SMA',
                    data: data.map(d => ({ x: d.date, y: d.sma })),
                    borderColor: '#2979ff',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    borderWidth: 1.5,
                }
            ],
        };
    }, [data, symbol]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    usePointStyle: true,
                    pointStyle: 'circle',
                }
            },
            tooltip: {
                backgroundColor: 'rgba(16, 32, 48, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month'
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                }
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
            {chartData ? <Line options={options} data={chartData} /> : <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>No hay datos disponibles</Typography>}
        </Box>
    );
};

export default AssetChart;
