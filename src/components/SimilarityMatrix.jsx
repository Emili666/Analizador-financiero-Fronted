import React from 'react';
import { Box, Typography, Stack, Tooltip } from '@mui/material';

const SimilarityHeatmap = ({ similarities, loading }) => {
    if (loading) return <Typography>Loading heatmap...</Typography>;
    if (!similarities || similarities.length === 0) return <Typography color="text.secondary">No comparison data.</Typography>;

    // Helper to get color based on score
    // Assumes scores are normalized or we just use relative mapping for visual impact
    const getColor = (metric, score) => {
        if (metric === 'Pearson' || metric === 'Cosine') {
            // High is green, low is red
            const opacity = Math.abs(score);
            return score > 0 ? `rgba(0, 230, 118, ${opacity})` : `rgba(255, 82, 82, ${opacity})`;
        }
        // For Euclidean/DTW, lower is "closer/better"
        // Just using a consistent primary glow for now
        return 'rgba(41, 121, 255, 0.6)';
    };

    return (
        <Stack spacing={2} sx={{ mt: 1 }}>
            {similarities.map((item) => (
                <Box key={item.metric}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {item.metric}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {item.score.toFixed(4)}
                        </Typography>
                    </Stack>
                    <Tooltip title={`${item.metric}: ${item.score.toFixed(4)}`} arrow>
                        <Box
                            sx={{
                                height: 32,
                                width: '100%',
                                borderRadius: 1.5,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    width: item.metric === 'Pearson' || item.metric === 'Cosine'
                                        ? `${Math.abs(item.score * 100)}%`
                                        : '100%', // For others just show a bar or heatmap cell
                                    bgcolor: getColor(item.metric, item.score),
                                    boxShadow: `0 0 15px ${getColor(item.metric, item.score)}`,
                                    transition: 'width 0.5s ease-out',
                                }}
                            />
                        </Box>
                    </Tooltip>
                </Box>
            ))}
        </Stack>
    );
};

export default SimilarityHeatmap;
