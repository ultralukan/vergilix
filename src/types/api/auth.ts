export interface RegisterRQType {
  email: string;
  password: string;
  captchaToken: string;
  referrerId?: string;
}

export interface LoginRQType {
  email: string;
  password: string;
  captchaToken: string;
  referrerId?: string;
}

export interface ResendVerifRQType {
  email: string;
}

export interface ResetPasswordRQType {
  email: string;
}

export interface RequestResetPasswordRQType {
  email: string;
}

export interface VerifyEmailRQType {
  email: string;
}

export interface AuthRPType {
  message: string;
}