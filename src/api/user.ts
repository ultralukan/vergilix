import { UserType } from "@/types/user";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getUser: builder.query<UserType, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
      providesTags: ['USER']
    }),
    updateUser: builder.mutation<UserType, UserType>({
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