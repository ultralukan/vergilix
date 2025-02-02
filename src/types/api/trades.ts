import {StatusType} from "@/types/trades";

export type TradeRQType = {
  fromCurrency: string;
  toCurrency: string,
  amount: string,
  phoneNumber: string,
  telegramLogin?: string,
}

export type TradeUpdateRQType = {
  id: string,
  data: {
    status: StatusType;
  }
}

export type TradeRPType = {
  message: string;
  trade: never,
}
