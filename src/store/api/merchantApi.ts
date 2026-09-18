import { baseApi } from './baseApi';
import type { ApiResponse, Pagination } from './authApi';

export interface Merchant {
  id: string;
  business_name: string;
  status: string;
  owner_id: string;
  country_id: string;
  created_at: string;
  updated_at: string;
}

export interface MerchantInvite {
  id: string;
  role_id: string;
  email: string;
  merchant_id: string;
  account_id: string;
  account_mid: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MerchantAccount {
  id: string;
  account_id: string;
  merchant_id: string;
  role_id: string;
  status: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const merchantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMerchants: builder.query<ApiResponse<{ merchants: Merchant[] }>, void>({
      query: () => '/api/v1/merchants',
      providesTags: ['Merchants'],
    }),

    getAdminMerchants: builder.query<
      ApiResponse<{ items: Merchant[]; pagination: Pagination }>,
      { page?: number; limit?: number }
    >({
      query: (params = {}) => ({ url: '/api/v1/merchants/admin', params }),
      providesTags: ['Merchants'],
    }),

    getMerchantDetails: builder.query<ApiResponse<Merchant>, string>({
      query: (merchant_id) => `/api/v1/merchants/${merchant_id}/details`,
      providesTags: (_result, _err, id) => [{ type: 'Merchants', id }],
    }),

    acceptInvite: builder.mutation<
      ApiResponse<{ needs_registration: boolean; merchant: Merchant; invite: MerchantInvite }>,
      { token: string; password: string }
    >({
      query: (body) => ({ url: '/api/v1/merchants/invites/accept', method: 'POST', body }),
    }),

    inviteAccount: builder.mutation<
      ApiResponse<MerchantInvite>,
      { merchant_id: string; email: string; role_id: string }
    >({
      query: ({ merchant_id, ...body }) => ({
        url: `/api/v1/merchants/${merchant_id}/invites`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MerchantAccounts'],
    }),

    reinviteAccount: builder.mutation<
      ApiResponse<MerchantInvite>,
      { merchant_id: string; invite_id: string }
    >({
      query: ({ merchant_id, invite_id }) => ({
        url: `/api/v1/merchants/${merchant_id}/invites/${invite_id}/reinvite`,
        method: 'POST',
      }),
    }),

    getMerchantAccounts: builder.query<
      ApiResponse<{ items: MerchantAccount[]; pagination: Pagination }>,
      { merchant_id: string; page?: number; limit?: number; status?: 'active' | 'inactive' | 'suspended' }
    >({
      query: ({ merchant_id, ...params }) => ({
        url: `/api/v1/merchants/${merchant_id}/accounts`,
        params,
      }),
      providesTags: ['MerchantAccounts'],
    }),

    suspendAccount: builder.mutation<
      ApiResponse<MerchantAccount>,
      { merchant_id: string; account_id: string }
    >({
      query: ({ merchant_id, account_id }) => ({
        url: `/api/v1/merchants/${merchant_id}/accounts/${account_id}/suspend`,
        method: 'POST',
      }),
      invalidatesTags: ['MerchantAccounts'],
    }),

    activateAccount: builder.mutation<
      ApiResponse<MerchantAccount>,
      { merchant_id: string; account_id: string }
    >({
      query: ({ merchant_id, account_id }) => ({
        url: `/api/v1/merchants/${merchant_id}/accounts/${account_id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: ['MerchantAccounts'],
    }),
  }),
});

export const {
  useGetMerchantsQuery,
  useGetAdminMerchantsQuery,
  useGetMerchantDetailsQuery,
  useAcceptInviteMutation,
  useInviteAccountMutation,
  useReinviteAccountMutation,
  useGetMerchantAccountsQuery,
  useSuspendAccountMutation,
  useActivateAccountMutation,
} = merchantApi;
