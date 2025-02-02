export type WithdrawalRQType = {
  bank: string;
  amount: number,
  phoneNumber: string,
}

export type WithdrawalRPType = {
  message: string;
  withdrawal: never,
}