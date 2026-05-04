import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, CircularProgress, Grid, Stack, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Divider
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Zap, Clock, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Metadatos fijos de cada algoritmo para la sección educativa
const ALGO_META = {
    'Distancia Euclidiana': {
        icon: <TrendingUp size={18} color="#ffeb3b" />,
        color: '#ffeb3b',
        formula: 'd(X,Y) = √( Σᵢ (xᵢ − yᵢ)² )',
        bestCase: 'O(n)',
        worstCase: 'O(n)',
        space: 'O(1)',
        desc: 'Recorre ambas series una sola vez acumulando la suma de diferencias al cuadrado. Sin estructuras auxiliares.',
    },
    'Correlación de Pearson': {
        icon: <Activity size={18} color="#00e676" />,
        color: '#00e676',
        formula: 'r = [Σxy − (ΣxΣy)/n] / √[(Σx²−(Σx)²/n)(Σy²−(Σy)²/n)]',
        bestCase: 'O(n)',
        worstCase: 'O(n)',
        space: 'O(1)',
        desc: 'Un único recorrido acumulando 5 sumas (Σx, Σy, Σx², Σy², Σxy). Constante de tiempo real mayor que Euclidiana por las 5 acumulaciones.',
    },
    'Similitud Coseno': {
        icon: <Zap size={18} color="#2979ff" />,
        color: '#2979ff',
        formula: 'cos(θ) = (X·Y) / (‖X‖ × ‖Y‖)',
        bestCase: 'O(n)',
        worstCase: 'O(n)',
        space: 'O(1)',
        desc: 'Similar a Pearson pero sin centrar los datos. Calcula producto punto y dos normas en un solo recorrido.',
    },
    'Dynamic Time Warping (DTW)': {
        icon: <Clock size={18} color="#ff5252" />,
        color: '#ff5252',
        formula: 'DTW(i,j) = |x(i)−y(j)| + min(DTW(i−1,j), DTW(i,j−1), DTW(i−1,j−1))',
        bestCase: 'O(n²)',
        worstCase: 'O(n²)',
        space: 'O(n²)',
        desc: 'Programación dinámica con tabla (n+1)×(m+1). Cada celda depende de 3 vecinos. Cuadrático en tiempo y espacio — el más costoso de los 4.',
    },
};

const SimilarityBenchmark = ({ apiBase, sym1, sym2 }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBenchmark();
    }, [sym1, sym2]);

    const fetchBenchmark = async () => {
        setLoading(true);
        try {
            const params = sym1 && sym2 ? `?sym1=${sym1}&sym2=${sym2}` : '';
            const res = await axios.get(`${apiBase}/benchmark/similarity${params}`);
            setData(res.data);
        } catch (err) {
            console.error('Error fetching similarity benchmark', err);
        }
        setLoading(false);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    if (!data || data.length === 0) return (
        <Typography color="text.secondary">No hay datos de benchmark disponibles.</Typography>
    );

    // Separar O(n) de O(n²) para dos gráficas
    const linearAlgos = data.filter(d => d.complexity === 'O(n)');
    const quadraticAlgos = data.filter(d => d.complexity !== 'O(n)');

    const makeChartData = (items, color) => ({
        labels: items.map(d => d.algorithm),
        datasets: [{
            label: 'Tiempo promedio (μs)',
            data: items.map(d => d.timeUs),
            backgroundColor: items.map(d => ALGO_META[d.algorithm]?.color + '99' || color),
            borderColor: items.map(d => ALGO_META[d.algorithm]?.color || color),
            borderWidth: 2,
            borderRadius: 6,
        }]
    });

    const chartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title, color: '#fff', font: { size: 13 } },
            tooltip: {
                backgroundColor: 'rgba(16,32,48,0.95)',
                callbacks: {
                    afterLabel: (ctx) => {
                        const item = data.find(d => d.algorithm === ctx.label);
                        return item ? [`n = ${item.seriesLength} retornos`, `Resultado: ${item.result?.toFixed(4)}`] : [];
                    }
                }
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.07)' }, ticks: { color: '#aaa' } },
            x: { grid: { display: false }, ticks: { color: '#aaa', font: { size: 11 } } }
        }
    });

    return (
        <Box>
            <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity size={22} /> Benchmark de Algoritmos de Similitud
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Cada algoritmo se ejecutó <strong>10 veces</strong> sobre series de retornos diarios reales.
                Se reporta el tiempo promedio en microsegundos (μs) para reducir el ruido de la JVM.
                {sym1 && sym2 && <> Series: <strong>{sym1}</strong> vs <strong>{sym2}</strong>.</>}
            </Typography>

            {/* Gráficas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(16,32,48,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ height: 260 }}>
                            <Bar data={makeChartData(linearAlgos)} options={chartOptions('Algoritmos O(n) — Tiempo lineal')} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, bgcolor: 'rgba(16,32,48,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ height: 260 }}>
                            <Bar data={makeChartData(quadraticAlgos)} options={chartOptions('Algoritmos O(n²) — Tiempo cuadrático')} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tarjetas de complejidad */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                Análisis de Complejidad Algorítmica
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {data.map((item) => {
                    const meta = ALGO_META[item.algorithm] || {};
                    return (
                        <Grid item xs={12} sm={6} md={3} key={item.algorithm}>
                            <Paper sx={{
                                p: 2.5, height: '100%',
                                bgcolor: 'rgba(16,32,48,0.6)',
                                border: `1px solid ${meta.color}33`,
                                borderTop: `3px solid ${meta.color}`,
                            }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                    {meta.icon}
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                                        {item.algorithm}
                                    </Typography>
                                </Stack>

                                {/* Tiempo medido */}
                                <Typography variant="h5" sx={{ fontWeight: 800, color: meta.color, mb: 0.5 }}>
                                    {item.timeUs.toLocaleString()} μs
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                    promedio de 10 ejecuciones · n={item.seriesLength}
                                </Typography>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 1.5 }} />

                                {/* Complejidades */}
                                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Tiempo:</Typography>
                                        <Chip label={meta.worstCase || item.complexity} size="small"
                                            sx={{ fontSize: '0.65rem', height: 18, bgcolor: meta.color + '22', color: meta.color }} />
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Espacio:</Typography>
                                        <Chip label={meta.space || 'O(n²)'} size="small"
                                            sx={{ fontSize: '0.65rem', height: 18, bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }} />
                                    </Stack>
                                </Stack>

                                {/* Fórmula */}
                                <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 1, p: 1, mb: 1 }}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.65rem', color: meta.color, wordBreak: 'break-all' }}>
                                        {meta.formula}
                                    </Typography>
                                </Box>

                                {/* Resultado calculado */}
                                <Typography variant="caption" color="text.secondary">
                                    Resultado: <strong style={{ color: '#fff' }}>{item.result?.toFixed(6)}</strong>
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Tabla comparativa */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                Tabla Comparativa
            </Typography>
            <TableContainer component={Paper} sx={{ bgcolor: 'rgba(16,32,48,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['Algoritmo', 'Complejidad Tiempo', 'Complejidad Espacio', 'Tiempo Medido (μs)', 'n (retornos)', 'Resultado'].map(h => (
                                <TableCell key={h} sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => {
                            const meta = ALGO_META[item.algorithm] || {};
                            return (
                                <TableRow key={item.algorithm} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {meta.icon}
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.algorithm}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={meta.worstCase || item.complexity} size="small"
                                            sx={{ bgcolor: meta.color + '22', color: meta.color, fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={meta.space || 'O(n²)'} size="small"
                                            sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }} />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', color: meta.color, fontWeight: 700 }}>
                                        {item.timeUs.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{item.seriesLength}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        {item.result?.toFixed(6)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}>
                * DTW se ejecuta sobre una subserie de n=300 retornos para evitar bloqueo del servidor (complejidad O(n²) con n completo ≈ 1250 tomaría ~1.5M operaciones).
                Los algoritmos O(n) se ejecutan sobre la serie completa.
            </Typography>
        </Box>
    );
};

export default SimilarityBenchmark;
