import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  merchantId: string | null;
  activityId: string | null;
}

const initialState: AuthState = {
  accessToken: null,
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
      action: PayloadAction<{ accessToken: string; email: string; merchantId?: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
      if (action.payload.merchantId) state.merchantId = action.payload.merchantId;
    },
    setActivityId(state, action: PayloadAction<string>) {
      state.activityId = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.email = null;
      state.merchantId = null;
      state.activityId = null;
    },
  },
});

export const { setCredentials, setActivityId, clearAuth } = authSlice.actions;
export default authSlice.reducer;
