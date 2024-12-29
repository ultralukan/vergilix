"use client"

import { Provider } from 'react-redux';
import { store, useAppDispatch } from '../store';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Language, setAuthLoading, setLanguage, setToken, setUser } from '@/store/slices/authSlice';
import { createTheme, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import { ruRU } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useGetUserQuery } from '@/api/user';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';

type ProvidersProps = {
  children: React.ReactNode;
};

export const customBreakpoints = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1200,
      xxl: 1440,
      xxxl: 1920,
    },
  },
};


function Providers({ children }: ProvidersProps) {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState(createTheme(ruRU));
  const language = Cookies.get("language") || 'ru';

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const localeTheme = language === "ru" ? ruRU : enUS;
    console.log(localeTheme)
    const newTheme = createTheme(
      {
        ...customBreakpoints,
      },
      localeTheme
    );
    setTheme(newTheme);
  }, []);

  if (!isClient) {
    return <Provider store={store}>{children}</Provider>;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
          <StoreInitializer>{children}</StoreInitializer>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = Cookies.get("token") || null;
  const language = Cookies.get('language') || null;
  const {data: user = null, isFetching} = useGetUserQuery(undefined, {skip: !token});

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));

      if(user) {
        dispatch(setUser(user))
      }
    }

    if (!isFetching) {
      dispatch(setAuthLoading(false));
    }

    if (language) {
      dispatch(setLanguage(language as Language));
    }
  }, [dispatch, token, user, language, isFetching]);

  return <>{children}</>;
}

export default Providers;
