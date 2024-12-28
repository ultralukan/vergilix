import { UserType } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language =  'ru' | 'en';

interface AuthState {
  token: string | null;
  user: UserType | null;
  isVerif: boolean;
  language: Language;
  isAuthLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  language: 'ru',
  isVerif: false,
  isAuthLoading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setVerif: (state) => {
      state.isVerif = true;
    },
    logout: (state) => {
      state.token = null;
    },
    setUser(state, action: PayloadAction<UserType | null>) {
      state.user = action.payload;
    },
    setLanguage(state, action: PayloadAction<'en' | 'ru'>) {
      state.language = action.payload;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
  },
});

export const { setToken, logout, setUser, setLanguage, setVerif, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
