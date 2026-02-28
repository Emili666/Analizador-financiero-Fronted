import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Box, TablePagination, CircularProgress
} from '@mui/material';

const AssetHistoryTable = ({ data, loading, symbol }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || !data.history || data.history.length === 0) {
        return <Typography color="text.secondary" sx={{ p: 2 }}>No hay datos históricos disponibles.</Typography>;
    }

    // Sort descending by date (newest first)
    const sortedHistory = [...data.history].sort((a, b) => new Date(b.date) - new Date(a.date));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatVolume = (val) => {
        return new Intl.NumberFormat('en-US').format(val);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <TableContainer component={Paper} sx={{ bgcolor: 'rgba(16, 32, 48, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Fecha</TableCell>
                            <TableCell align="right" sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Apertura (Open)</TableCell>
                            <TableCell align="right" sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Máximo (High)</TableCell>
                            <TableCell align="right" sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Mínimo (Low)</TableCell>
                            <TableCell align="right" sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Cierre (Close)</TableCell>
                            <TableCell align="right" sx={{ bgcolor: '#102030', color: 'text.secondary', fontWeight: 600 }}>Volumen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                            <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{formatDate(row.date)}</TableCell>
                                <TableCell align="right">{formatCurrency(row.open)}</TableCell>
                                <TableCell align="right">{formatCurrency(row.high)}</TableCell>
                                <TableCell align="right">{formatCurrency(row.low)}</TableCell>
                                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 500 }}>{formatCurrency(row.close)}</TableCell>
                                <TableCell align="right">{formatVolume(row.volume)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={sortedHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
                sx={{ color: 'text.secondary' }}
            />
        </Box>
    );
};

export default AssetHistoryTable;
