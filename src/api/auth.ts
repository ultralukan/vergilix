import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    register: builder.mutation<{message: string}, {email: string, password: string, captchaToken: string, referrerId?: string}>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<{data: {message?: string}, token?: string}, {email: string, password: string, captchaToken: string}>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    resendVerification: builder.mutation<{message: string}, {email: string}>({
      query: (data) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<{message: string}, {email: string}>({
      query: (data) => ({
        url: `/auth/verify-email?token=${data}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation
} = authApi;