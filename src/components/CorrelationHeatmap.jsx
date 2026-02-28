import React from 'react';
import { Box, Typography, Tooltip, Stack } from '@mui/material';

const CorrelationHeatmap = ({ assets, matrix, loading }) => {
    if (loading) return <Typography>Generando matriz...</Typography>;
    if (!assets || assets.length === 0 || !matrix) return <Typography color="text.secondary">No hay datos de correlación disponibles.</Typography>;

    // Matrix is expected to be { [symbol1]: { [symbol2]: score } }
    const symbols = assets.map(a => a.symbol).slice(0, 15); // Limit to 15 for better UI

    const getColor = (score) => {
        const val = Math.abs(score);
        if (score > 0) return `rgba(0, 230, 118, ${val})`; // Green for positive
        return `rgba(255, 82, 82, ${val})`; // Red for negative
    };

    return (
        <Box sx={{ overflowX: 'auto', mt: 2, pb: 2 }}>
            <Box sx={{ minWidth: 600 }}>
                {/* Header */}
                <Stack direction="row" spacing={0.5} sx={{ mb: 0.5, pl: 10 }}>
                    {symbols.map(s => (
                        <Box key={s} sx={{ width: 35, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, transform: 'rotate(-45deg)', display: 'inline-block' }}>
                                {s}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                {/* Rows */}
                {symbols.map(s1 => (
                    <Stack key={s1} direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                        <Box sx={{ width: 80, pr: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>{s1}</Typography>
                        </Box>
                        {symbols.map(s2 => {
                            const score = matrix[s1]?.[s2] ?? 0;
                            return (
                                <Tooltip key={s2} title={`${s1} vs ${s2}: ${score.toFixed(4)}`} arrow>
                                    <Box
                                        sx={{
                                            width: 35,
                                            height: 35,
                                            bgcolor: getColor(score),
                                            borderRadius: 0.5,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': { border: '1px solid #fff', zIndex: 1 }
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                                            {score !== 1 ? score.toFixed(2) : '1'}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Stack>
                ))}
            </Box>
        </Box>
    );
};

export default CorrelationHeatmap;
