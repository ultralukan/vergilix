
import { baseApi } from "./baseApi";
import {TradeRPType, TradeRQType, TradeUpdateRQType} from "@/types/api/trades";
import {TradeType} from "@/types/trades";

export const tradesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    postTrade: builder.mutation<TradeRPType, TradeRQType>({
      query: (data) => ({
        url: '/trades',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['TRADE']
    }),
    updateTrade: builder.mutation<TradeRPType, TradeUpdateRQType>({
      query: ({id, data}) => ({
        url: `/trades/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['TRADE']
    }),
    getUserTrade: builder.query<TradeType, string>({
      query: (id) => ({
        url: `/trades/${id}`,
        method: 'GET',
      }),
      providesTags: ['TRADE']
    }),
    getAllUserTrades: builder.query<TradeType[], void>({
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
  useGetAllUserTradesQuery,
  useUpdateTradeMutation
} = tradesApi;