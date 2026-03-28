import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Chip } from '@mui/material';
import { Zap, Timer, BarChart3, TrendingUp } from 'lucide-react';
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
            label: 'Tiempo de ejecución (μs)',
            data: Object.values(results),
            backgroundColor: 'rgba(0, 230, 118, 0.6)',
            borderColor: '#00e676',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    // Filtrar algoritmos más rápidos para la gráfica de detalle
    const sortedForSmall = Object.entries(results).sort((a,b) => a[1] - b[1]);
    // Tomamos los más rápidos (por ejemplo, los 8 mejores o hasta que lleguemos al 60% del dataset)
    const smallEntries = sortedForSmall.slice(0, Math.round(sortedForSmall.length * 0.7));
    
    const smallData = {
        labels: smallEntries.map(([algo]) => algo),
        datasets: [{
            label: 'Tiempo de ejecución (μs)',
            data: smallEntries.map(([_, time]) => time),
            backgroundColor: 'rgba(33, 150, 243, 0.6)',
            borderColor: '#2196f3',
            borderWidth: 1,
            borderRadius: 4,
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

    const sortedResults = Object.entries(results).sort((a, b) => a[1] - b[1]);
    const fastest = sortedResults[0];
    const slowest = sortedResults[sortedResults.length - 1];
    const avg = Object.values(results).reduce((a, b) => a + b, 0) / Object.values(results).length;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChart3 size={24} /> Desempeño de Algoritmos de Ordenamiento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Análisis comparativo de algoritmos para un dataset de {results['Selection Sort'] ? 'precios históricos' : 'n elementos'} (Microsegundos).
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.1)' }}>
                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(0, 230, 118, 0.1)', color: 'primary.main' }}>
                            <Zap size={20} />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Algoritmo más veloz</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{fastest[0]}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255, 82, 82, 0.05)', border: '1px solid rgba(255, 82, 82, 0.1)' }}>
                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(255, 82, 82, 0.1)', color: '#ff5252' }}>
                            <Timer size={20} />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Algoritmo más lento</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{slowest[0]}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', border: '1px solid rgba(33, 150, 243, 0.1)' }}>
                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                            <TrendingUp size={20} />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Promedio de ejecución</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{Math.round(avg).toLocaleString()} μs</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BarChart3 size={20} /> Vista General: Comparativa de Tiempos (Todos)
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Zap size={20} /> Detalle: Algoritmos de Alto Rendimiento
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <Bar 
                                data={smallData} 
                                options={{
                                    ...options,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        ...options.plugins,
                                        title: { display: false }
                                    }
                                }} 
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                            * Esta gráfica omite los algoritmos más lentos para permitir una comparación visual precisa de los métodos más eficientes.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

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
