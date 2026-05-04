import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Container, Grid, Paper, Typography, Stack, Button, IconButton } from '@mui/material';
import { Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import AssetSelector from './components/AssetSelector';
import AssetCandlestickChart from './components/AssetCandlestickChart';
import SimilarityMatrix from './components/SimilarityMatrix';
import PatternBarChart from './components/PatternBarChart';
import RiskRanking from './components/RiskRanking';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import AssetHistoryTable from './components/AssetHistoryTable';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import SortingBenchmark from './components/SortingBenchmark';
import SimilarityBenchmark from './components/SimilarityBenchmark';
import CurrencySelector from './components/CurrencySelector';
import { useCurrency } from './hooks/useCurrency';

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
    const [activeTab, setActiveTab] = useState('Panel Principal');
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [compareAsset, setCompareAsset] = useState('');
    const [chartData, setChartData] = useState([]);
    const [compareChartData, setCompareChartData] = useState([]);
    const [similarities, setSimilarities] = useState([]);
    const [patterns, setPatterns] = useState(null);
    const [correlationMatrix, setCorrelationMatrix] = useState(null);
    const [windowSize, setWindowSize] = useState(3);
    const [loading, setLoading] = useState({ chart: false, compareChart: false, assets: false, matrix: false });
    const { currency, setCurrency, convert, format, currencyInfo } = useCurrency();

    useEffect(() => {
        fetchAssets();
        fetchCorrelationMatrix();
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
            fetchCompareChartData(compareAsset);
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
            }
        } catch (err) { console.error("Error fetching assets", err); }
        setLoading(prev => ({ ...prev, assets: false }));
    };

    const fetchCorrelationMatrix = async () => {
        setLoading(prev => ({ ...prev, matrix: true }));
        try {
            const res = await axios.get(`${API_BASE}/correlation-matrix`);
            // The backend returns { assets: ["AAPL", "MSFT"...], matrix: [[1, 0.5], [0.5, 1]] }
            // The frontend map needs: { "AAPL": { "MSFT": 0.5 } }
            const { assets: assetList, matrix: arrayMatrix } = res.data;
            const formattedMatrix = {};

            assetList.forEach((sym1, i) => {
                formattedMatrix[sym1] = {};
                assetList.forEach((sym2, j) => {
                    formattedMatrix[sym1][sym2] = arrayMatrix[i][j];
                });
            });

            setCorrelationMatrix(formattedMatrix);
        } catch (err) { console.error("Error fetching matrix", err); }
        setLoading(prev => ({ ...prev, matrix: false }));
    };

    const fetchChartData = async (symbol) => {
        setLoading(prev => ({ ...prev, chart: true }));
        try {
            const res = await axios.get(`${API_BASE}/chart/${symbol}`);
            setChartData(res.data);
        } catch (err) { console.error("Error fetching chart", err); }
        setLoading(prev => ({ ...prev, chart: false }));
    };

    const fetchCompareChartData = async (symbol) => {
        setLoading(prev => ({ ...prev, compareChart: true }));
        try {
            const res = await axios.get(`${API_BASE}/chart/${symbol}`);
            setCompareChartData(res.data);
        } catch (err) { console.error("Error fetching compare chart", err); }
        setLoading(prev => ({ ...prev, compareChart: false }));
    };

    const fetchPatterns = async (symbol, ws = windowSize) => {
        try {
            const res = await axios.get(`${API_BASE}/patterns/${symbol}?windowSize=${ws}`);
            setPatterns(res.data);
        } catch (err) { console.error("Error fetching patterns", err); }
    };

    const handleWindowChange = (newSize) => {
        setWindowSize(newSize);
        if (selectedAsset) fetchPatterns(selectedAsset, newSize);
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

    const handleDownloadComparativeReport = () => {
        if (selectedAsset && compareAsset) {
            window.open(`${API_BASE}/report/comparative/pdf?sym1=${selectedAsset}&sym2=${compareAsset}`, '_blank');
        }
    };

    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
                    <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
                    <Box component="main" sx={{ flexGrow: 1, ml: '280px', p: 4 }}>
                        <Container maxWidth="xl">
                            {/* Header */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                <Box>
                                    <Typography variant="h4" gutterBottom color="primary.main">
                                        Laboratorio de Análisis Financiero
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
                                        Reporte Técnico PDF
                                    </Button>
                                </Stack>
                            </Stack>

                            <Grid container spacing={3}>
                                {activeTab === 'Panel Principal' && (
                                    <>
                                        <Grid item xs={12}>
                                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end">
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Activo Principal</Typography>
                                                    <AssetSelector assets={assets} selectedAsset={selectedAsset} onSelect={setSelectedAsset} />
                                                </Box>
                                                <Box sx={{ pb: 0.5 }}>
                                                    <CurrencySelector currency={currency} onChange={setCurrency} />
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 3, height: 500, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h6">Análisis de Velas (OHLC)</Typography>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Typography variant="caption" color="text.secondary">
                                                            {currencyInfo.flag} Precios en {currencyInfo.code} — {currencyInfo.label}
                                                        </Typography>
                                                        <Typography variant="caption" color="primary.main">Algoritmo SMA Aplicado</Typography>
                                                    </Stack>
                                                </Stack>
                                                <AssetCandlestickChart
                                                    data={chartData}
                                                    symbol={selectedAsset}
                                                    loading={loading.chart}
                                                    convert={convert}
                                                    format={format}
                                                    currency={currency}
                                                />
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 3, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Box>
                                                        <Typography variant="h6">Datos Históricos ({selectedAsset})</Typography>
                                                        <Typography variant="caption" color="text.secondary">Precios Diarios OHLCV — {currencyInfo.flag} {currencyInfo.code}</Typography>
                                                    </Box>
                                                </Stack>
                                                <AssetHistoryTable
                                                    data={chartData}
                                                    symbol={selectedAsset}
                                                    loading={loading.chart}
                                                    format={format}
                                                />
                                            </Paper>
                                        </Grid>
                                    </>
                                )}

                                {activeTab === 'Análisis de Mercado' && (
                                    <>
                                        <Grid item xs={12} lg={7}>
                                            <Paper sx={{ p: 3, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="h6" gutterBottom>Mapa de Calor de Correlación Global</Typography>
                                                <Typography variant="caption" color="text.secondary">Matriz de similitud cruzada (Pearson/Lineal)</Typography>
                                                <CorrelationHeatmap assets={assets} matrix={correlationMatrix} loading={loading.assets} />
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} lg={5}>
                                            <Paper sx={{ p: 3, height: '100%', bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="h6" gutterBottom>Frecuencia de Patrones</Typography>
                                                <PatternBarChart patterns={patterns} windowSize={windowSize} onWindowChange={handleWindowChange} />
                                            </Paper>
                                        </Grid>
                                    </>
                                )}

                                {activeTab === 'Similitud de Activos' && (
                                    <>
                                        <Grid item xs={12}>
                                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Activo Principal</Typography>
                                                    <AssetSelector assets={assets} selectedAsset={selectedAsset} onSelect={setSelectedAsset} />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Comparar con</Typography>
                                                    <AssetSelector assets={assets} selectedAsset={compareAsset} onSelect={setCompareAsset} />
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <ComparativeAnalysis
                                                s1={selectedAsset}
                                                s2={compareAsset}
                                                data1={chartData}
                                                data2={compareChartData}
                                                similarities={similarities}
                                                loading={loading.chart || loading.compareChart}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 3, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom>Similitud 1-vs-1 (Detalles)</Typography>
                                                        <Typography variant="caption" color="secondary.main" sx={{ display: 'block' }}>
                                                            {selectedAsset} vs {compareAsset}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                                <SimilarityMatrix similarities={similarities} />
                                            </Paper>
                                        </Grid>
                                    </>
                                )}

                                {activeTab === 'Portafolio de Riesgos' && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 3, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Typography variant="h6" gutterBottom>Ranking de Riesgo de Activos</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Clasificación Algorítmica (Vol. Anual)</Typography>
                                            <RiskRanking assets={assets} loading={loading.assets} />
                                        </Paper>
                                    </Grid>
                                )}

                                {activeTab === 'Benchmarks de Ordenamiento' && (
                                    <Grid item xs={12}>
                                        <Stack spacing={4}>
                                            <SimilarityBenchmark
                                                apiBase={API_BASE}
                                                sym1={selectedAsset}
                                                sym2={compareAsset}
                                            />
                                            <SortingBenchmark apiBase={API_BASE} />
                                        </Stack>
                                    </Grid>
                                )}

                                {activeTab === 'Reportes' && (
                                    <Grid item xs={12}>
                                        <Stack spacing={4}>
                                            <Paper sx={{ p: 4, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="h6" gutterBottom>Reporte Técnico Global (PDF)</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                    Descarga un informe completo que incluye el análisis de mercado de todos los activos,
                                                    el mapa de correlación global y el ranking de riesgos de tu portafolio.
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Download size={18} />}
                                                    onClick={handleDownloadReport}
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        color: '#000',
                                                        fontWeight: 600,
                                                        px: 4, py: 1.5,
                                                        '&:hover': { bgcolor: '#00c853' }
                                                    }}
                                                >
                                                    Generar Reporte Completo
                                                </Button>
                                            </Paper>

                                            <Paper sx={{ p: 4, bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="h6" gutterBottom>Reporte de Análisis Comparativo (PDF)</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                    Genera un documento que exponga las diferencias y similitudes detalladas entre dos activos en particular.
                                                    Requiere haber seleccionado dos activos.
                                                </Typography>

                                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Activo 1</Typography>
                                                        <AssetSelector assets={assets} selectedAsset={selectedAsset} onSelect={setSelectedAsset} />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>Activo 2</Typography>
                                                        <AssetSelector assets={assets} selectedAsset={compareAsset} onSelect={setCompareAsset} />
                                                    </Box>
                                                </Stack>

                                                <Button
                                                    variant="contained"
                                                    startIcon={<Download size={18} />}
                                                    onClick={handleDownloadComparativeReport}
                                                    disabled={!selectedAsset || !compareAsset}
                                                    sx={{
                                                        bgcolor: 'secondary.main',
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        px: 4, py: 1.5,
                                                        '&:hover': { bgcolor: '#2962ff' }
                                                    }}
                                                >
                                                    Generar Reporte Comparativo
                                                </Button>
                                            </Paper>
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
