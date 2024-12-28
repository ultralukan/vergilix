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
