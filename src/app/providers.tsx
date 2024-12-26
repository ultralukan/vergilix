"use client"

import { Provider } from 'react-redux';
import { store, useAppDispatch } from '../store';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Language, setLanguage, setToken } from '@/store/slices/authSlice';
import { createTheme, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import { ruRU } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

type ProvidersProps = {
  children: React.ReactNode;
};

function Providers({ children }: ProvidersProps) {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState(createTheme(ruRU));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const language = Cookies.get('language');
    const newTheme = language === 'ru' ? createTheme(ruRU) : createTheme(enUS);
    setTheme(newTheme);
  }, []);

  if (!isClient) {
    return <Provider store={store}>{children}</Provider>;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StoreInitializer>{children}</StoreInitializer>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      dispatch(setToken(token));
    }

    const language = Cookies.get('language');
    if (language) {
      dispatch(setLanguage(language as Language));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default Providers;
