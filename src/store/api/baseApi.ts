import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../index';
import { clearAuth, setCredentials } from '../authSlice';
import { getDeviceId } from '../../lib/deviceId';
import { getCookie } from '../../lib/cookie';

const HMAC_SECRET = import.meta.env.VITE_HMAC_SIGNATURE_SECRET as string;

async function sha256Hex(input: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function buildSignedHeaders(
  method: string,
  path: string,
  body: unknown,
): Promise<Record<string, string>> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(HMAC_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const timestamp = Date.now().toString();
  const nonce = generateNonce();
  const bodyStr = body !== undefined && body !== null ? JSON.stringify(body) : '';
  const bodyHash = await sha256Hex(bodyStr);

  const canonical = [method.toUpperCase(), path, timestamp, nonce, bodyHash].join('\n');

  const sigBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(canonical));
  const signature = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { 'x-signature': signature, 'x-timestamp': timestamp, 'x-nonce': nonce };
}

async function withSignature(args: string | FetchArgs): Promise<string | FetchArgs> {
  const method = typeof args === 'object' ? (args.method ?? 'GET') : 'GET';
  const path = typeof args === 'object' ? args.url : args;
  const body = typeof args === 'object' ? args.body : undefined;
  const [extra, deviceId] = await Promise.all([
    buildSignedHeaders(method, path, body),
    getDeviceId(),
  ]);
  const allHeaders = { ...extra, 'x-device-id': deviceId };
  if (typeof args === 'string') {
    return { url: args, headers: allHeaders };
  }
  return {
    ...args,
    headers: { ...((args.headers as Record<string, string>) ?? {}), ...allHeaders },
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
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
  let result = await rawBaseQuery(await withSignature(args), api, extraOptions);

  if (result.error?.status !== 401) return result;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        api.dispatch(clearAuth());
        return false;
      }

      const refreshResult = await rawBaseQuery(
        await withSignature({ url: '/api/v1/account/refresh', method: 'POST', body: { refresh_token: refreshToken } }),
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const data = (refreshResult.data as { data: { access_token: string } }).data;
        const newRefreshToken = getCookie('refresh_token') ?? undefined;
        api.dispatch(
          setCredentials({
            accessToken: data.access_token,
            refreshToken: newRefreshToken,
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
    result = await rawBaseQuery(await withSignature(args), api, extraOptions);
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Merchants', 'MerchantAccounts', 'AuditLogs', 'Roles', 'UserProfile'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
