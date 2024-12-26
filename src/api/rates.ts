import { baseApi } from "./baseApi";
import { RateType } from "@/types/rate";

export const ratesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getRate: builder.query<RateType[], void>({
      query: () => ({
        url: '/rates',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetRateQuery
} = ratesApi;