import { baseApi } from './baseApi';
import type { ApiResponse, Pagination } from './authApi';

export interface AuditLog {
  id: string;
  account: { id: string; email: string };
  merchant_id: string;
  resource: string;
  resource_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface AuditParams {
  page?: number;
  limit?: number;
  account_id?: string;
  resource?: string;
  action?: string;
  from?: string;
  to?: string;
}

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAuditLogs: builder.query<
      ApiResponse<{ items: AuditLog[]; pagination: Pagination }>,
      AuditParams & { scope?: 'system' | 'merchant'; merchant_id?: string }
    >({
      query: (params = {}) => ({ url: '/api/v1/audit/admin', params }),
      providesTags: ['AuditLogs'],
    }),

    getMerchantAuditLogs: builder.query<
      ApiResponse<{ items: AuditLog[]; pagination: Pagination }>,
      AuditParams & { merchant_id: string }
    >({
      query: ({ merchant_id, ...params }) => ({
        url: `/api/v1/audit/merchants/${merchant_id}`,
        params,
      }),
      providesTags: ['AuditLogs'],
    }),
  }),
});

export const { useGetAdminAuditLogsQuery, useGetMerchantAuditLogsQuery } = auditApi;
