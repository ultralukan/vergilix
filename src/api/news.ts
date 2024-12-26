import { NewsType } from "@/types/news";
import { baseApi } from "./baseApi";

export const newsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getNews: builder.query<NewsType[], void>({
      query: () => ({
        url: '/news',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetNewsQuery
} = newsApi;