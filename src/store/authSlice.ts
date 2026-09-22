import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  accountId: string | null;
  email: string | null;
  merchantId: string | null;
  activityId: string | null;
}

const TOKEN_KEY = 'rt';

function loadRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveRefreshToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: loadRefreshToken(),
  accountId: null,
  email: null,
  merchantId: null,
  activityId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string; email: string; accountId?: string; merchantId?: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        saveRefreshToken(action.payload.refreshToken);
      }
      state.email = action.payload.email;
      if (action.payload.accountId) state.accountId = action.payload.accountId;
      if (action.payload.merchantId) state.merchantId = action.payload.merchantId;
    },
    setMerchant(state, action: PayloadAction<{ merchantId: string; accountId?: string }>) {
      state.merchantId = action.payload.merchantId;
      if (action.payload.accountId) state.accountId = action.payload.accountId;
    },
    setActivityId(state, action: PayloadAction<string>) {
      state.activityId = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.accountId = null;
      state.email = null;
      state.merchantId = null;
      state.activityId = null;
      saveRefreshToken(null);
    },
  },
});

export const { setCredentials, setMerchant, setActivityId, clearAuth } = authSlice.actions;
export default authSlice.reducer;
