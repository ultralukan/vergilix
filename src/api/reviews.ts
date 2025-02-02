import { baseApi } from "./baseApi";
import {ReviewsRPType} from "@/types/api/reviews";

export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getReviews: builder.query<ReviewsRPType[], void>({
      query: () => ({
        url: '/reviews',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetReviewsQuery
} = reviewsApi;