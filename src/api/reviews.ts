import { ReviewType } from "@/types/review";
import { baseApi } from "./baseApi";

export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getReviews: builder.query<ReviewType[], void>({
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