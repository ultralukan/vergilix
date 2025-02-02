export type UserRQType = {
  fullName?: string;
  phoneNumber?: string;
  telegram?: string;
  password?: string;
  verificationPhoto?: string;
  balance?: number;
};

export type UserType = {
  _id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  telegram?: string;
  accounts?: {
    chain: string;
    accountNumber: string;
  }[];
  referrals?: string[];
  referralEarnings?: number;
  registrationDate?: string;
  isVerified: boolean;
};