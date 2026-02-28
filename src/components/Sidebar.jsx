import React from 'react';
import { Box, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import { LayoutDashboard, BarChart3, TrendingUp, AlertTriangle, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <BarChart3 size={20} />, label: 'Market Analysis' },
    { icon: <TrendingUp size={20} />, label: 'Asset Similarity' },
    { icon: <AlertTriangle size={20} />, label: 'Risk Portfolio' },
    { icon: <FileText size={20} />, label: 'Reports' },
];

const Sidebar = () => {
    return (
        <Box
            sx={{
                width: 280,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bgcolor: 'rgba(16, 32, 48, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                zIndex: 1200,
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 6 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)',
                    }}
                >
                    <TrendingUp color="#050812" size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    Finance<span style={{ color: '#00e676' }}>IQ</span>
                </Typography>
            </Stack>

            <Stack spacing={1} sx={{ flexGrow: 1 }}>
                {menuItems.map((item, index) => (
                    <Box
                        key={index}
                        component={motion.div}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: item.active ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
                            color: item.active ? 'primary.main' : 'text.secondary',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: item.active ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                color: 'primary.main',
                            },
                        }}
                    >
                        {item.icon}
                        <Typography sx={{ ml: 2, fontWeight: item.active ? 600 : 400, fontSize: '0.95rem' }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Stack>

            <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'secondary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Settings size={16} />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Admin User</Typography>
                        <Typography variant="caption" color="text.secondary">Software Engineer</Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default Sidebar;
