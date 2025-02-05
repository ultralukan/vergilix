import { baseApi } from "./baseApi";
import {StakingRPType} from "@/types/api/staking";

export const stakingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createStaking: builder.mutation<StakingRPType[], void>({
        query: (data) => ({
          url: '/staking',
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['STAKING']
      }),
      getUserStakings: builder.query<StakingRPType[], void>({
        query: () => ({
          url: '/user/stakings',
          method: 'GET',
        }),
        providesTags: ['STAKING']
      }),
  }),
});

export const {
  useCreateStakingMutation,
  useGetUserStakingsQuery
} = stakingApi;