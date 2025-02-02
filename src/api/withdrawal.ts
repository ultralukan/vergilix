import { baseApi } from "./baseApi";
import {WithdrawalRPType, WithdrawalRQType} from "@/types/api/withdrawal";

export const withdrawalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      postWithdrawal: builder.mutation<WithdrawalRPType, WithdrawalRQType>({
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