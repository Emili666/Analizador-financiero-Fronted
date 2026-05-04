import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Stack, Chip } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WINDOW_OPTIONS = [
    { value: 3,  label: '3d',  desc: 'Impulso corto' },
    { value: 5,  label: '5d',  desc: 'Tendencia semanal' },
    { value: 10, label: '10d', desc: 'Tendencia quincenal' },
];

const PatternBarChart = ({ patterns, windowSize, onWindowChange }) => {
    if (!patterns) return <Typography color="text.secondary">Seleccione un activo.</Typography>;

    const data = {
        labels: [
            `Consecutivos al Alza (ventana ${patterns.windowSize || windowSize}d)`,
            'Envolvente Alcista'
        ],
        datasets: [{
            label: 'Frecuencia de ocurrencias',
            data: [patterns.consecutiveUp || 0, patterns.bullishEngulfing || 0],
            backgroundColor: ['rgba(0, 230, 118, 0.6)', 'rgba(41, 121, 255, 0.6)'],
            borderColor: ['#00e676', '#2979ff'],
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(16, 32, 48, 0.9)',
                cornerRadius: 8,
                callbacks: {
                    afterLabel: (ctx) => {
                        const total = patterns.totalDays || 0;
                        if (total > 0) {
                            const pct = ((ctx.raw / total) * 100).toFixed(1);
                            return `${pct}% de los ${total} días analizados`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } }
        }
    };

    return (
        <Box>
            {/* Selector de ventana deslizante */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Algoritmo: Sliding Window
                </Typography>
                <ToggleButtonGroup
                    value={windowSize}
                    exclusive
                    onChange={(_, val) => val && onWindowChange(val)}
                    size="small"
                >
                    {WINDOW_OPTIONS.map(opt => (
                        <ToggleButton
                            key={opt.value}
                            value={opt.value}
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                                px: 1.5,
                                '&.Mui-selected': { color: 'primary.main', bgcolor: 'rgba(0,230,118,0.1)' }
                            }}
                        >
                            {opt.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>

            {/* Chips de contexto */}
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                <Chip
                    label={`${patterns.totalDays || 0} días analizados`}
                    size="small"
                    sx={{ fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }}
                />
                <Chip
                    label={`Riesgo: ${patterns.risk || '—'}`}
                    size="small"
                    sx={{
                        fontSize: '0.65rem',
                        bgcolor: patterns.risk === 'Agresivo'
                            ? 'rgba(255,82,82,0.1)'
                            : patterns.risk === 'Moderado'
                                ? 'rgba(41,121,255,0.1)'
                                : 'rgba(0,230,118,0.1)',
                        color: patterns.risk === 'Agresivo' ? '#ff5252'
                            : patterns.risk === 'Moderado' ? '#2979ff' : '#00e676'
                    }}
                />
                <Chip
                    label={`Vol: ${patterns.volatility ? (patterns.volatility * 100).toFixed(1) + '%' : '—'}`}
                    size="small"
                    sx={{ fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }}
                />
            </Stack>

            <Box sx={{ height: 180 }}>
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
};

export default PatternBarChart;
