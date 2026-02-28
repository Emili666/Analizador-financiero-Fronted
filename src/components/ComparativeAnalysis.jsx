import React, { useMemo } from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { TrendingUp, MoveHorizontal, Baseline, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend);

const ComparativeAnalysis = ({ s1, s2, data1, data2, similarities, loading }) => {

    const chartData = useMemo(() => {
        if (!data1 || !data1.history || !data2 || !data2.history) return null;

        // Normalizing to percentage change for fair visual comparison
        const startPrice1 = data1.history[0]?.close || 1;
        const startPrice2 = data2.history[0]?.close || 1;

        return {
            datasets: [
                {
                    label: `${s1} (% Cambio)`,
                    data: data1.history.map(d => ({ x: new Date(d.date), y: ((d.close - startPrice1) / startPrice1) * 100 })),
                    borderColor: '#00e676',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1,
                },
                {
                    label: `${s2} (% Cambio)`,
                    data: data2.history.map(d => ({ x: new Date(d.date), y: ((d.close - startPrice2) / startPrice2) * 100 })),
                    borderColor: '#2979ff',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1,
                }
            ]
        };
    }, [data1, data2, s1, s2]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(16, 32, 48, 0.9)',
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                    }
                }
            },
        },
        scales: {
            x: { type: 'time', time: { unit: 'month' }, grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } }
        }
    };

    const metricDetails = {
        'euclidean': { title: 'Distancia Euclidiana', icon: <Baseline size={20} color="#ffeb3b" />, desc: 'Distancia directa entre precios o retornos. Valores más cercanos a 0 indican mayor similitud exacta.' },
        'pearson': { title: 'Correlación de Pearson', icon: <TrendingUp size={20} color="#00e676" />, desc: 'Mide la relación lineal (-1 a 1). Valores cerca de 1 indican que se mueven en la misma dirección.' },
        'dtw': { title: 'Dynamic Time Warping (DTW)', icon: <Activity size={20} color="#ff5252" />, desc: 'Compara secuencias que difieren en velocidad o fase temporal. Menor valor implica mayor similitud de forma.' },
        'cosine': { title: 'Similitud Coseno', icon: <MoveHorizontal size={20} color="#2979ff" />, desc: 'Mide el ángulo entre vectores de rendimiento. Útil para comparar la dirección del movimiento sin importar la magnitud.' }
    };

    if (loading) return <Typography>Cargando análisis comparativo...</Typography>;
    if (!similarities || similarities.length === 0) return <Typography color="text.secondary">Seleccione dos activos para comparar.</Typography>;

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom color="primary.main">Análisis Comparativo Detallado de Algoritmos</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comparación directa entre <strong>{s1}</strong> y <strong>{s2}</strong> utilizando múltiples métricas de similitud en sus series temporales.
            </Typography>

            <Grid container spacing={3}>
                {/* 4 Metrics Cards */}
                {similarities.map((sim, idx) => {
                    const detail = metricDetails[sim.metric] || { title: sim.metric, icon: <TrendingUp size={20} />, desc: 'Métrica de similitud algorítmica.' };
                    return (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(16, 32, 48, 0.5)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    {detail.icon}
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{detail.title}</Typography>
                                </Stack>
                                <Typography variant="h5" sx={{ my: 1, fontWeight: 800, color: 'text.primary' }}>
                                    {sim.score.toFixed(4)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                                    {detail.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}

                {/* Overlaid Chart for Correlation Visual */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: 400, bgcolor: 'rgba(16, 32, 48, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h6" gutterBottom>Superposición Temporal (Porcentaje de Retorno)</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Los precios han sido normalizados a un % de cambio desde el inicio del periodo para comparar la estructura de las series de tiempo.
                        </Typography>
                        <Box sx={{ height: 300, width: '100%' }}>
                            {chartData ? <Line options={options} data={chartData} /> : <Typography>Cargando gráfico de comparación...</Typography>}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ComparativeAnalysis;
