import { baseApi } from './baseApi';
import type { ApiResponse } from './authApi';

export interface Role {
  id: string;
  name: string;
  description: string;
  type: 'custom' | 'system';
  scope: 'system' | 'merchant';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface PermissionItem {
  permission: string;
  action: string;
  resource: string;
  field: string | null;
}

interface PermissionsResponse {
  permissions: PermissionItem[];
  grouped_by_resource: Record<string, PermissionItem[]>;
  actions: string[];
  resources: string[];
}

export const rbacApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<
      ApiResponse<Role>,
      { name: string; description: string; permissions: string[]; scope: string }
    >({
      query: (body) => ({ url: '/api/v1/rbac/roles', method: 'POST', body }),
      invalidatesTags: ['Roles'],
    }),

    getRoles: builder.query<ApiResponse<Role[]>, { scope?: 'system' | 'merchant' }>({
      query: (params = {}) => ({ url: '/api/v1/rbac/roles', params }),
      providesTags: ['Roles'],
    }),

    getPermissions: builder.query<ApiResponse<PermissionsResponse>, void>({
      query: () => '/api/v1/rbac/permissions',
    }),

    getRoleById: builder.query<ApiResponse<Role>, string>({
      query: (id) => `/api/v1/rbac/roles/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Roles', id }],
    }),

    updateRole: builder.mutation<
      ApiResponse<Role>,
      { id: string; name?: string; description?: string; permissions?: string[] }
    >({
      query: ({ id, ...body }) => ({ url: `/api/v1/rbac/roles/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => ['Roles', { type: 'Roles', id }],
    }),

    deleteRole: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/v1/rbac/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Roles'],
    }),

    assignRole: builder.mutation<
      ApiResponse<null>,
      { account_id: string; role_id: string }
    >({
      query: (body) => ({ url: '/api/v1/rbac/assign-role', method: 'POST', body }),
    }),

    removeRole: builder.mutation<
      ApiResponse<null>,
      { account_id: string; role_id: string }
    >({
      query: (body) => ({ url: '/api/v1/rbac/remove-role', method: 'POST', body }),
    }),

    getAccountRoles: builder.query<ApiResponse<Role[]>, string>({
      query: (account_id) => `/api/v1/rbac/accounts/${account_id}/roles`,
    }),

    getAccountPermissions: builder.query<ApiResponse<Record<string, boolean>>, string>({
      query: (account_id) => `/api/v1/rbac/accounts/${account_id}/permissions`,
    }),

    merchantAssignRole: builder.mutation<
      ApiResponse<null>,
      { merchant_id: string; account_id: string; role_id: string; permissions?: string[] }
    >({
      query: ({ merchant_id, ...body }) => ({
        url: `/api/v1/merchants/${merchant_id}/rbac/assign-role`,
        method: 'POST',
        body,
      }),
    }),

    merchantRemoveRole: builder.mutation<
      ApiResponse<null>,
      { merchant_id: string; account_id: string; role_id: string; permissions?: string[] }
    >({
      query: ({ merchant_id, ...body }) => ({
        url: `/api/v1/merchants/${merchant_id}/rbac/remove-role`,
        method: 'POST',
        body,
      }),
    }),

    getMerchantAccountPermissions: builder.query<
      ApiResponse<string[]>,
      { merchant_id: string; account_id: string }
    >({
      query: ({ merchant_id, account_id }) =>
        `/api/v1/merchants/${merchant_id}/rbac/accounts/${account_id}/permissions`,
    }),

    updateMerchantAccountPermissions: builder.mutation<
      ApiResponse<null>,
      { merchant_id: string; account_id: string; role_id: string; permissions: string[] }
    >({
      query: ({ merchant_id, account_id, ...body }) => ({
        url: `/api/v1/merchants/${merchant_id}/rbac/accounts/${account_id}/permissions`,
        method: 'PUT',
        body,
      }),
    }),

    getMerchantAccountRoles: builder.query<
      ApiResponse<Role[]>,
      { merchant_id: string; account_id: string }
    >({
      query: ({ merchant_id, account_id }) =>
        `/api/v1/merchants/${merchant_id}/rbac/accounts/${account_id}/roles`,
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetPermissionsQuery,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useGetAccountRolesQuery,
  useGetAccountPermissionsQuery,
  useMerchantAssignRoleMutation,
  useMerchantRemoveRoleMutation,
  useGetMerchantAccountPermissionsQuery,
  useUpdateMerchantAccountPermissionsMutation,
  useGetMerchantAccountRolesQuery,
} = rbacApi;
