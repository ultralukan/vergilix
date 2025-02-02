import { baseApi } from "./baseApi";
import {NewsType} from "@/types/api/news";

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