"use client"

import { Provider } from 'react-redux';
import { store, useAppDispatch } from '../store';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Language, setAuthLoading, setLanguage, setRates, setToken, setUser } from '@/store/slices/authSlice';
import { createTheme, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import { ruRU } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useGetUserQuery } from '@/api/user';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import { useGetRateQuery } from '@/api/rates';
import { VideoComponent } from '@/components/Video';

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
  const language = Cookies.get("language") || null;
  const { data: user = null, isFetching } = useGetUserQuery(undefined, { skip: !token });
  const { data: rates = [], isFetching: isFetchingRates } = useGetRateQuery();

  const [showVideo, setShowVideo] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      if (user) dispatch(setUser(user));
    }

    if (rates.length) {
      dispatch(setRates(rates));
    }

    if (!isFetching || !isFetchingRates) {
      dispatch(setAuthLoading(false));
    }

    if (language) {
      dispatch(setLanguage(language));
    }
  }, [dispatch, token, user, language, isFetching, rates, isFetchingRates]);

  useEffect(() => {
    const minDisplayTime = 2000;
    const minTimeTimer = setTimeout(() => {

      if (!isFetching && !isFetchingRates) {
        setFadeOut(true);
        setTimeout(() => setShowVideo(false), 1000);
      }
    }, minDisplayTime);

    if (!isFetching && !isFetchingRates) {
      clearTimeout(minTimeTimer);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowVideo(false), 1000);
      }, minDisplayTime);
    }

    return () => clearTimeout(minTimeTimer);
  }, [isFetching, isFetchingRates]);

  return <>{showVideo ? <VideoComponent fadeOut={fadeOut} /> : children}</>;
}

export default Providers;
