import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query";
import Cookies from 'js-cookie';

const url = process.env.NEXT_PUBLIC_API_ADDRESS;

export const baseQuery = fetchBaseQuery({
  baseUrl: url,
  prepareHeaders: (headers) => {
    const token = Cookies.get('token');

    if (token) {
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    const statuses = [401, 403]

    if (result.error && typeof result.error.status === 'number') {
      if (statuses.includes(result.error.status) && api.endpoint !== "login") {
        Cookies.remove('token');
        window.open('/login', '_self');
      }
    }
    return result;
};