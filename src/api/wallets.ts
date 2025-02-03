import { baseApi } from "./baseApi";
import {WithdrawalRPType} from "@/types/api/withdrawal";

export const walletsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getWallets: builder.query<WithdrawalRPType, void>({
        query: () => ({
          url: '/wallets',
          method: 'GET',
        }),
      }),
  }),
});

export const {
  useGetWalletsQuery
} = walletsApi;