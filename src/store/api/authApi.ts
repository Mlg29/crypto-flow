import { baseApi } from './baseApi';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  offset: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
  total_pages: number;
  page: number;
  total_items: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  dial_code: string;
  created_at: string;
  updated_at: string;
}

interface Account {
  id: string;
  email: string;
  role: string;
  status: string;
  has_2fa_enabled: boolean;
}

interface Merchant {
  id: string;
  business_name: string;
  status: string;
  owner_id: string;
  country_id: string;
}

interface Session {
  id: string;
  status: string;
  login_time: string;
  expiration_time: string;
  logout_time: string;
  ip_address: string;
  user_agent: string;
  device_id: string;
  otp_verified: boolean;
  _2fa_verified: boolean;
}

interface Activity {
  id: string;
  type: string;
  status: string;
  email: string;
  otp_verified: boolean;
  two_fa_verified: boolean;
  verified_time: string;
  expiration_time: string;
  session_id: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<{ account: Account; access_token: string; is_new_account: boolean }>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: '/api/v1/account/login', method: 'POST', body }),
    }),

    refresh: builder.mutation<
      ApiResponse<{ access_token: string }>,
      { refresh_token?: string }
    >({
      query: (body) => ({ url: '/api/v1/account/refresh', method: 'POST', body }),
    }),

    resetPassword: builder.mutation<
      ApiResponse<null>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: '/api/v1/account/reset-password', method: 'POST', body }),
    }),

    sendOtp: builder.mutation<
      ApiResponse<{ activity_id: string }>,
      { email: string; activity_id?: string; activity_type?: string }
    >({
      query: (body) => ({ url: '/api/v1/account/otp/send', method: 'POST', body }),
    }),

    verifyOtp: builder.mutation<
      ApiResponse<{ activity_id: string }>,
      { otp: string; activity_id: string }
    >({
      query: (body) => ({ url: '/api/v1/account/otp/verify', method: 'POST', body }),
    }),

    getSessions: builder.query<
      ApiResponse<{ items: Session[]; pagination: Pagination }>,
      { page?: number; limit?: number; status?: string; device_id?: string }
    >({
      query: (params) => ({ url: '/api/v1/account/sessions', params }),
    }),

    getActivities: builder.query<
      ApiResponse<{ items: Activity[]; pagination: Pagination }>,
      { page?: number; limit?: number; session_id?: string; type?: string; status?: string }
    >({
      query: (params) => ({ url: '/api/v1/account/activities', params }),
    }),

    createMerchant: builder.mutation<
      ApiResponse<{ merchant: Merchant; access_token: string; is_new_account: boolean }>,
      { business_name: string; country_id: string; email: string; password: string }
    >({
      query: (body) => ({ url: '/api/v1/merchants', method: 'POST', body }),
    }),
    getCountries: builder.query<
      ApiResponse<{ items: Country[]; pagination: Pagination }>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params = {}) => ({ url: '/api/v1/location/country', params }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetSessionsQuery,
  useGetActivitiesQuery,
  useCreateMerchantMutation,
  useGetCountriesQuery,
} = authApi;
