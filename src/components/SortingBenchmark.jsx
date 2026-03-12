import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SortingBenchmark = ({ apiBase }) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBenchmark();
    }, []);

    const fetchBenchmark = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiBase}/benchmark`);
            setResults(res.data);
        } catch (err) {
            console.error("Error fetching benchmarks", err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!results || Object.keys(results).length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay datos de benchmark disponibles.</Typography>
            </Box>
        );
    }

    const data = {
        labels: Object.keys(results),
        datasets: [{
            label: 'Tiempo de ejecución (microsegundos)',
            data: Object.values(results),
            backgroundColor: 'rgba(0, 230, 118, 0.5)',
            borderColor: '#00e676',
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Comparativa de Algoritmos (Tiempos)', color: '#fff' }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#fff' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#fff' }
            }
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom color="primary.main">
                Desempeño de Algoritmos de Ordenamiento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Medición del tiempo requerido para ordenar un dataset consolidado de precios históricos (Microsegundos).
            </Typography>

            <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Bar data={data} options={options} />
            </Paper>

            <TableContainer component={Paper} sx={{ bgcolor: 'rgba(16, 32, 48, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Algoritmo</TableCell>
                            <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Tiempo (μs)</TableCell>
                            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Complejidad (Teórica)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(results).map(([algo, time]) => (
                            <TableRow key={algo}>
                                <TableCell sx={{ color: '#fff' }}>{algo}</TableCell>
                                <TableCell align="right" sx={{ color: '#fff' }}>{time.toLocaleString()}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    {getComplexity(algo)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const getComplexity = (algo) => {
    switch (algo) {
        case 'Selection Sort': return 'O(n²)';
        case 'QuickSort': return 'O(n log n)';
        case 'HeapSort': return 'O(n log n)';
        case 'Gnome Sort': return 'O(n²)';
        case 'Comb Sort': return 'O(n²)';
        case 'TimSort': return 'O(n log n)';
        case 'Tree Sort': return 'O(n log n)';
        case 'Pigeonhole Sort': return 'O(n + Range)';
        case 'Bucket Sort': return 'O(n + k)';
        case 'Bitonic Sort': return 'O(n log² n)';
        case 'Binary Insertion Sort': return 'O(n²)';
        case 'Radix Sort': return 'O(nk)';
        default: return 'N/A';
    }
};

export default SortingBenchmark;
