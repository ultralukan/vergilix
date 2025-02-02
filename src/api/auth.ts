import { baseApi } from "./baseApi";
import {
  AuthRPType, LoginRQType, RegisterRQType, RequestResetPasswordRQType, ResendVerifRQType, ResetPasswordRQType, VerifyEmailRQType
} from "@/types/api/auth";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    register: builder.mutation<AuthRPType, RegisterRQType>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<{data: {message?: string}, token?: string}, LoginRQType>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    resendVerification: builder.mutation<AuthRPType, ResendVerifRQType>({
      query: (data) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body: data,
      }),
    }),
    resetPasswordRequest: builder.mutation<AuthRPType, RequestResetPasswordRQType>({
      query: (data) => ({
        url: '/auth/request-password-reset',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<AuthRPType, ResetPasswordRQType>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<AuthRPType, VerifyEmailRQType>({
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
  useVerifyEmailMutation,
  useResetPasswordRequestMutation,
  useResetPasswordMutation
} = authApi;