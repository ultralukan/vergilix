import { ReviewType } from "@/types/review";
import { baseApi } from "./baseApi";

export const stakingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    createStaking: builder.mutation<ReviewType[], void>({
      query: (data) => ({
        url: '/staking',
        method: 'POST',
        body: data
      }),
    }),
  }),
});

export const {
  useCreateStakingMutation
} = stakingApi;