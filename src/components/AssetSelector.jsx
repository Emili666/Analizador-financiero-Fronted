import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { Search } from 'lucide-react';

const AssetSelector = ({ assets, selectedAsset, onSelect }) => {
    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Search size={20} color="rgba(255, 255, 255, 0.5)" />
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    Seleccionar Activo
                </Typography>
            </Stack>

            <FormControl size="small" sx={{ flexGrow: 1, minWidth: 200, maxWidth: { sm: 300 } }}>
                <Select
                    value={selectedAsset}
                    onChange={(e) => onSelect(e.target.value)}
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                >
                    {assets.map((asset) => (
                        <MenuItem key={asset.symbol} value={asset.symbol}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography sx={{ fontWeight: 700 }}>{asset.symbol}</Typography>
                                <Typography variant="caption" color="text.secondary">{asset.name}</Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    );
};

export default AssetSelector;
