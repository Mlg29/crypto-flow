import { configureStore, isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer, { clearAuth } from './authSlice';
import { baseApi } from './api/baseApi';
import { toast } from '../lib/toast';

const apiErrorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number; data?: { message?: string } };
    const status = payload?.status;
    if (typeof status === 'number' && status >= 500) {
      toast.danger(payload?.data?.message ?? 'Server error. Please try again.');
    }
  }
  return next(action);
};

const resetCacheOnLogout: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const result = next(action);
    if (clearAuth.match(action as Parameters<typeof clearAuth.match>[0])) {
      dispatch(baseApi.util.resetApiState());
    }
    return result;
  };

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, apiErrorMiddleware, resetCacheOnLogout),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
