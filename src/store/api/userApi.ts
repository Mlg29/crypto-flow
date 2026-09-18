import { baseApi } from './baseApi';
import type { ApiResponse } from './authApi';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  picture: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/api/v1/user',
      providesTags: ['UserProfile'],
    }),

    updateUser: builder.mutation<
      ApiResponse<UserProfile>,
      { first_name?: string; last_name?: string; middle_name?: string; phone_number?: string }
    >({
      query: (body) => ({ url: '/api/v1/user', method: 'PUT', body }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;
