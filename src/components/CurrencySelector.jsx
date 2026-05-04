import React from 'react';
import { ToggleButton, ToggleButtonGroup, Tooltip, Stack, Typography } from '@mui/material';
import { CURRENCIES } from '../hooks/useCurrency';

const CurrencySelector = ({ currency, onChange }) => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="text.secondary">Moneda:</Typography>
            <ToggleButtonGroup
                value={currency}
                exclusive
                onChange={(_, val) => val && onChange(val)}
                size="small"
            >
                {CURRENCIES.map(c => (
                    <Tooltip key={c.code} title={c.label} arrow>
                        <ToggleButton
                            value={c.code}
                            sx={{
                                px: 1.2,
                                py: 0.4,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: 'text.secondary',
                                border: '1px solid rgba(255,255,255,0.1)',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    bgcolor: 'rgba(0,230,118,0.1)',
                                    borderColor: 'rgba(0,230,118,0.3)',
                                },
                            }}
                        >
                            {c.flag} {c.code}
                        </ToggleButton>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>
        </Stack>
    );
};

export default CurrencySelector;
