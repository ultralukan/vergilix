import { UserType, UserTypeApi } from "@/types/user";
import { baseApi } from "./baseApi";

export const withdrawalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      postWithdrawal: builder.mutation<UserType, UserTypeApi>({
        query: (data) => ({
          url: '/withdrawals',
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['WITHDRAWAL']
      }),
  }),
});

export const {
  usePostWithdrawalMutation
} = withdrawalApi;