import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Box, Typography, CircularProgress } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CandlestickController,
    CandlestickElement
);

const AssetLineChart = ({ data, symbol, loading }) => {
    const chartData = useMemo(() => {
        if (!data || !data.history || !Array.isArray(data.history) || data.history.length === 0) return null;

        const datasets = [
            {
                label: `Velas OHLC ${symbol}`,
                type: 'candlestick',
                data: data.history.map(d => ({
                    x: new Date(d.date).valueOf(),
                    o: d.open,
                    h: d.high,
                    l: d.low,
                    c: d.close,
                    v: d.volume
                })),
                color: {
                    up: '#00e676',
                    down: '#ff1744',
                    unchanged: '#9e9e9e',
                },
                borderColor: {
                    up: '#00e676',
                    down: '#ff1744',
                    unchanged: '#9e9e9e',
                }
            }
        ];

        if (data.sma20 && data.sma20.length > 0) {
            const smaLength = data.sma20.length;
            const historyLength = data.history.length;
            const offset = historyLength - smaLength;
            const smaData = data.sma20.map((val, i) => ({
                x: new Date(data.history[i + offset].date).valueOf(),
                y: val
            }));
            datasets.push({
                label: `SMA(20)`,
                type: 'line',
                data: smaData,
                borderColor: '#2979ff',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
                borderDash: [5, 5],
            });
        }

        return { datasets };
    }, [data, symbol]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, labels: { color: 'rgba(255,255,255,0.7)' } },
            tooltip: {
                backgroundColor: 'rgba(16, 32, 48, 0.9)',
                titleColor: '#fff',
                callbacks: {
                    label: function (context) {
                        const datasetLabel = context.dataset.label || '';
                        if (datasetLabel === 'SMA (20)') {
                            return `SMA 20: ${context.parsed.y.toFixed(2)}`;
                        }
                        const point = context.raw;
                        return [
                            `Apertura: $${point.o.toFixed(2)}`,
                            `Máximo: $${point.h.toFixed(2)}`,
                            `Mínimo: $${point.l.toFixed(2)}`,
                            `Cierre: $${point.c.toFixed(2)}`,
                            `Volumen: ${point.v.toLocaleString()}`,
                        ];
                    }
                }
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
            {chartData ? <Chart type='candlestick' options={options} data={chartData} /> : <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>No hay datos disponibles</Typography>}
        </Box>
    );
};

export default AssetLineChart;
