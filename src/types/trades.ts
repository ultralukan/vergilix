export type TradeType = {
	fromCurrency: string,
	toCurrency: string,
	amount: number,
	accountNumber?: string,
	telegramLogin?: string,
	email?: string
}

export type TradeGetType = {
	userId: string,
	fromCurrency: string,
	toCurrency: string,
	amount: number,
	rate: number,
	adjustedRate: number,
	receivedAmount?: string,
	accountNumber: string,
	telegramLogin?: string,
	status: string,
	createdAt: string
}

export type APITradeGetType = {
  message: string,
	trade?: TradeGetType
}