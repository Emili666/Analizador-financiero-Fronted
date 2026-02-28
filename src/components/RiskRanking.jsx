import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Stack, Box } from '@mui/material';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const RiskRanking = ({ assets, loading }) => {
    if (loading) return <Typography>Analyzing risk levels...</Typography>;
    if (!assets || assets.length === 0) return <Typography color="text.secondary">No asset data.</Typography>;

    // Sorting assets by risk (Agresivo > Moderado > Conservador)
    const riskOrder = { 'Agresivo': 3, 'Moderado': 2, 'Conservador': 1 };
    const sortedAssets = [...assets].sort((a, b) => (riskOrder[b.risk] || 0) - (riskOrder[a.risk] || 0));

    const getRiskStyles = (risk) => {
        switch (risk) {
            case 'Agresivo': return { color: '#ff5252', bg: 'rgba(255, 82, 82, 0.1)', icon: <ShieldAlert size={16} /> };
            case 'Moderado': return { color: '#2979ff', bg: 'rgba(41, 121, 255, 0.1)', icon: <Shield size={16} /> };
            case 'Conservador': return { color: '#00e676', bg: 'rgba(0, 230, 118, 0.1)', icon: <ShieldCheck size={16} /> };
            default: return { color: '#fff', bg: 'rgba(255, 255, 255, 0.1)', icon: <Shield size={16} /> };
        }
    };

    return (
        <TableContainer component={Box} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Asset</TableCell>
                        <TableCell sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Algorithm Risk</TableCell>
                        <TableCell align="right" sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Volatility</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedAssets.map((asset) => {
                        const styles = getRiskStyles(asset.risk);
                        return (
                            <TableRow key={asset.symbol} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{asset.symbol}</Typography>
                                    <Typography variant="caption" color="text.secondary">{asset.name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={styles.icon}
                                        label={asset.risk || 'N/A'}
                                        size="small"
                                        sx={{
                                            bgcolor: styles.bg,
                                            color: styles.color,
                                            fontWeight: 600,
                                            border: `1px solid ${styles.color}33`
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {asset.volatility ? `${(asset.volatility * 100).toFixed(2)}%` : '--'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RiskRanking;
