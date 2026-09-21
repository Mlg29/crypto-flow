import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  accountId: string | null;
  email: string | null;
  merchantId: string | null;
  activityId: string | null;
}

const initialState: AuthState = {
  accessToken: null,
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
      action: PayloadAction<{ accessToken: string; email: string; accountId?: string; merchantId?: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
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
      state.accountId = null;
      state.email = null;
      state.merchantId = null;
      state.activityId = null;
    },
  },
});

export const { setCredentials, setMerchant, setActivityId, clearAuth } = authSlice.actions;
export default authSlice.reducer;
