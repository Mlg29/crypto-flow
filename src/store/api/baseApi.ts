import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../index';
import { clearAuth, setCredentials } from '../authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        { url: '/api/v1/account/refresh', method: 'POST', body: {} },
        api,
        extraOptions,
      );
      if (refreshResult.data) {
        const data = (refreshResult.data as { data: { access_token: string } }).data;
        const state = api.getState() as RootState;
        api.dispatch(
          setCredentials({
            accessToken: data.access_token,
            email: state.auth.email!,
            merchantId: state.auth.merchantId ?? undefined,
          }),
        );
        return true;
      }
      api.dispatch(clearAuth());
      return false;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;
  if (refreshed) {
    result = await rawBaseQuery(args, api, extraOptions);
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Merchants', 'MerchantAccounts', 'AuditLogs', 'Roles', 'UserProfile'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
