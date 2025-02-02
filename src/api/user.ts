import { UserType } from "@/types/api/user";
import { baseApi } from "./baseApi";
import {UserRQType} from "@/types/api/user";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getUser: builder.query<UserType, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
      providesTags: ['USER', 'WITHDRAWAL']
    }),
    updateUser: builder.mutation<UserType, UserRQType>({
      query: (data) => ({
        url: '/user',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['USER']
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation
} = userApi;