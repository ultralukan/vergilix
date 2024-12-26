import { APITradeGetType, TradeGetType, TradeType } from "@/types/trades";
import { baseApi } from "./baseApi";

export const tradesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    postTrade: builder.mutation<APITradeGetType, TradeType>({
      query: (data) => ({
        url: '/trades',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['TRADE']
    }),
    getUserTrade: builder.query<TradeGetType, string>({
      query: (id) => ({
        url: `/trades/${id}`,
        method: 'GET',
      }),
      providesTags: ['TRADE']
    }),
    getAllUserTrades: builder.query<TradeGetType[], void>({
      query: () => ({
        url: `/user/trades`,
        method: 'GET',
      }),
      providesTags: ['TRADE']
    }),
    deleteTrade: builder.mutation<{message: string}, string>({
      query: (data) => ({
        url: `/trades/${data}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  usePostTradeMutation,
  useGetUserTradeQuery,
  useDeleteTradeMutation,
  useGetAllUserTradesQuery
} = tradesApi;