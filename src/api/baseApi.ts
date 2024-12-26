import {createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryConfig";

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['USER', 'TRADE'],
  endpoints: () => ({}),
});