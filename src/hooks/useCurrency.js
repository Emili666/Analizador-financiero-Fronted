/**
 * Hook de conversión de moneda para el panel principal.
 *
 * Tasas de cambio aproximadas respecto al USD (se actualizan al montar).
 * Fuente: frankfurter.app — API pública gratuita, sin token.
 *
 * Monedas soportadas:
 *   COP — Peso colombiano  (activos BVC)
 *   USD — Dólar americano  (ETFs NYSE/NASDAQ)
 *   EUR — Euro
 *   GBP — Libra esterlina
 *   BRL — Real brasileño
 */

import { useState, useEffect } from 'react';

export const CURRENCIES = [
    { code: 'COP', symbol: '$',  label: 'Peso colombiano',  flag: '🇨🇴' },
    { code: 'USD', symbol: '$',  label: 'Dólar americano',  flag: '🇺🇸' },
    { code: 'EUR', symbol: '€',  label: 'Euro',             flag: '🇪🇺' },
    { code: 'GBP', symbol: '£',  label: 'Libra esterlina',  flag: '🇬🇧' },
    { code: 'BRL', symbol: 'R$', label: 'Real brasileño',   flag: '🇧🇷' },
];

// Tasas de fallback (USD como base) por si la API falla
const FALLBACK_RATES_FROM_USD = {
    COP: 4100,
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    BRL: 5.05,
};

export function useCurrency() {
    const [currency, setCurrency] = useState('USD');
    // rates[X] = cuántos X vale 1 USD
    const [ratesFromUSD, setRatesFromUSD] = useState(FALLBACK_RATES_FROM_USD);
    const [loadingRates, setLoadingRates] = useState(true);

    useEffect(() => {
        // Frankfurter.app: API pública sin token, devuelve tasas base USD
        fetch('https://api.frankfurter.app/latest?base=USD&symbols=COP,EUR,GBP,BRL')
            .then(r => r.json())
            .then(data => {
                if (data.rates) {
                    setRatesFromUSD({ USD: 1, ...data.rates });
                }
            })
            .catch(() => {
                // Silencioso — usa fallback
            })
            .finally(() => setLoadingRates(false));
    }, []);

    /**
     * Convierte un precio desde su moneda nativa al currency seleccionado.
     *
     * Los activos colombianos (sufijo .CL) cotizan en COP.
     * Los ETFs globales cotizan en USD.
     *
     * @param {number} price       Precio original del activo
     * @param {string} assetSymbol Ticker del activo (para detectar moneda nativa)
     * @returns {number}           Precio convertido
     */
    const convert = (price, assetSymbol = '') => {
        if (!price || isNaN(price)) return price;

        // Detectar moneda nativa del activo
        const isColombian = assetSymbol.endsWith('.CL') ||
            ['ECOPETROL','ISA','GEB','BOGOTA','GRUPOAVAL','NUTRESA',
             'GRUPOSURA','CEMARGOS','PFAVAL','CELSIA'].includes(assetSymbol);

        const nativeCurrency = isColombian ? 'COP' : 'USD';
        if (nativeCurrency === currency) return price;

        // Convertir: nativa → USD → destino
        const priceInUSD = price / ratesFromUSD[nativeCurrency];
        return priceInUSD * ratesFromUSD[currency];
    };

    /**
     * Formatea un precio convertido con el símbolo y locale correctos.
     */
    const format = (price, assetSymbol = '') => {
        const converted = convert(price, assetSymbol);
        if (converted === undefined || converted === null || isNaN(converted)) return '—';

        const curr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[1];
        const locale = currency === 'COP' ? 'es-CO'
                     : currency === 'EUR' ? 'de-DE'
                     : currency === 'GBP' ? 'en-GB'
                     : currency === 'BRL' ? 'pt-BR'
                     : 'en-US';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'COP' ? 0 : 2,
            maximumFractionDigits: currency === 'COP' ? 0 : 2,
        }).format(converted);
    };

    const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[1];

    return { currency, setCurrency, convert, format, currencyInfo, loadingRates };
}
