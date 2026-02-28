import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { ArrowUpCircle, Target } from 'lucide-react';

const PatternList = ({ patterns, loading }) => {
    if (loading) return <Typography>Scanning patterns...</Typography>;
    if (!patterns) return <Typography color="text.secondary">Select an asset to view patterns.</Typography>;

    return (
        <Stack spacing={2}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.1)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <ArrowUpCircle size={18} color="#00e676" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Consecutive Up</Typography>
                </Stack>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                    {patterns.consecutiveUp || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Current frequency in historical data</Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(41, 121, 255, 0.05)', border: '1px solid rgba(41, 121, 255, 0.1)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Target size={18} color="#2979ff" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Bullish Engulfing</Typography>
                </Stack>
                <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 800 }}>
                    {patterns.bullishEngulfing || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Detected engulfing patterns</Typography>
            </Box>
        </Stack>
    );
};

export default PatternList;
