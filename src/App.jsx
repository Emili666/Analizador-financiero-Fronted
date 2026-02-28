import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Container, Grid, Paper, Typography, Stack, Button, IconButton } from '@mui/material';
import { Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import AssetSelector from './components/AssetSelector';
import AssetCandlestickChart from './components/AssetCandlestickChart';
import SimilarityMatrix from './components/SimilarityMatrix';
import PatternBarChart from './components/PatternBarChart';
import RiskRanking from './components/RiskRanking';
import CorrelationHeatmap from './components/CorrelationHeatmap';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#00e676' },
        secondary: { main: '#2979ff' },
        background: { default: '#050812', paper: '#102030' },
        text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
    },
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        h4: { fontWeight: 800, letterSpacing: '-0.02em' },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
});

const API_BASE = 'http://localhost:8080/api';

function App() {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [compareAsset, setCompareAsset] = useState('');
    const [chartData, setChartData] = useState([]);
    const [similarities, setSimilarities] = useState([]);
    const [patterns, setPatterns] = useState(null);
    const [correlationMatrix, setCorrelationMatrix] = useState(null);
    const [loading, setLoading] = useState({ chart: false, assets: false, matrix: false });

    useEffect(() => {
        fetchAssets();
    }, []);

    useEffect(() => {
        if (selectedAsset) {
            fetchChartData(selectedAsset);
            fetchPatterns(selectedAsset);
        }
    }, [selectedAsset]);

    useEffect(() => {
        if (selectedAsset && compareAsset) {
            fetchSimilarities(selectedAsset, compareAsset);
        }
    }, [selectedAsset, compareAsset]);

    const fetchAssets = async () => {
        setLoading(prev => ({ ...prev, assets: true }));
        try {
            const res = await axios.get(`${API_BASE}/assets`);
            setAssets(res.data);
            if (res.data.length > 0) {
                setSelectedAsset(res.data[0].symbol);
                setCompareAsset(res.data[1]?.symbol || res.data[0].symbol);

                // Construct correlation matrix from asset data if available
                // Or try to fetch a matrix endpoint if it existed
                const matrix = {};
                res.data.forEach(asset => {
                    matrix[asset.symbol] = asset.correlations || {};
                });
                setCorrelationMatrix(matrix);
            }
        } catch (err) { console.error("Error fetching assets", err); }
        setLoading(prev => ({ ...prev, assets: false }));
    };

    const fetchChartData = async (symbol) => {
        setLoading(prev => ({ ...prev, chart: true }));
        try {
            const res = await axios.get(`${API_BASE}/chart/${symbol}`);
            setChartData(res.data);
        } catch (err) { console.error("Error fetching chart", err); }
        setLoading(prev => ({ ...prev, chart: false }));
    };

    const fetchPatterns = async (symbol) => {
        try {
            const res = await axios.get(`${API_BASE}/patterns/${symbol}`);
            setPatterns(res.data);
        } catch (err) { console.error("Error fetching patterns", err); }
    };

    const fetchSimilarities = async (s1, s2) => {
        try {
            const res = await axios.get(`${API_BASE}/similarity?sym1=${s1}&sym2=${s2}`);
            const mapped = Object.entries(res.data).map(([metric, score]) => ({ metric, score }));
            setSimilarities(mapped);
        } catch (err) { console.error("Error fetching similarities", err); }
    };

    const handleDownloadReport = () => {
        window.open(`${API_BASE}/report/pdf`, '_blank');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, ml: '280px', p: 4 }}>
                    <Container maxWidth="xl">
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Box>
                                <Typography variant="h4" gutterBottom color="primary.main">
                                    Financial Analysis Lab
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Universidad del Quindío • Ingeniería de Sistemas
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <IconButton onClick={fetchAssets} sx={{ color: 'text.secondary' }}>
                                    <RefreshCw size={20} />
                                </IconButton>
                                <Button
                                    variant="contained"
                                    startIcon={<Download size={18} />}
                                    onClick={handleDownloadReport}
                                    sx={{
                                        bgcolor: 'rgba(0, 230, 118, 0.1)',
                                        color: 'primary.main',
                                        border: '1px solid rgba(0, 230, 118, 0.2)',
                                        '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.2)' },
                                        fontWeight: 600,
                                    }}
                                >
                                    Técnico PDF
                                </Button>
                            </Stack>
                        </Stack>

                        <Grid container spacing={3}>
                            {/* Comparison Selectors */}
                            <Grid item xs={12}>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Primary Asset</Typography>
                                        <AssetSelector assets={assets} selectedAsset={selectedAsset} onSelect={setSelectedAsset} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Compare vs</Typography>
                                        <AssetSelector assets={assets} selectedAsset={compareAsset} onSelect={setCompareAsset} />
                                    </Box>
                                </Stack>
                            </Grid>

                            {/* Main Chart */}
                            <Grid item xs={12} xl={8}>
                                <Paper sx={{ p: 3, height: 500, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6">Candlestick Analysis (OHLC)</Typography>
                                        <Typography variant="caption" color="primary.main">SMA Algorithm Applied</Typography>
                                    </Stack>
                                    <AssetCandlestickChart data={chartData} symbol={selectedAsset} loading={loading.chart} />
                                </Paper>
                            </Grid>

                            {/* Similarity & Patterns */}
                            <Grid item xs={12} xl={4}>
                                <Stack spacing={3} sx={{ height: '100%' }}>
                                    <Paper sx={{ p: 3, flex: 1, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography variant="h6" gutterBottom>1-vs-1 Similarity</Typography>
                                        <Typography variant="caption" color="secondary.main" sx={{ display: 'block', mb: 2 }}>
                                            {selectedAsset} vs {compareAsset}
                                        </Typography>
                                        <SimilarityMatrix similarities={similarities} />
                                    </Paper>
                                    <Paper sx={{ p: 3, flex: 1, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography variant="h6" gutterBottom>Pattern Frequency</Typography>
                                        <PatternBarChart patterns={patterns} />
                                    </Paper>
                                </Stack>
                            </Grid>

                            {/* Global Correlation Matrix */}
                            <Grid item xs={12} lg={7}>
                                <Paper sx={{ p: 3, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Typography variant="h6" gutterBottom>Global Correlation Heatmap</Typography>
                                    <Typography variant="caption" color="text.secondary">Cross-asset similarity matrix (Pearson/Lineal)</Typography>
                                    <CorrelationHeatmap assets={assets} matrix={correlationMatrix} loading={loading.assets} />
                                </Paper>
                            </Grid>

                            {/* Risk Ranking */}
                            <Grid item xs={12} lg={5}>
                                <Paper sx={{ p: 3, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Typography variant="h6" gutterBottom>Asset Risk Ranking</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Algorithmic Classification (Vol. Anual)</Typography>
                                    <RiskRanking assets={assets} loading={loading.assets} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
