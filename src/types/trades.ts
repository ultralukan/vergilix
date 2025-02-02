export interface StatusType {
	status: 'completed' | 'pending' | 'cancelled' | 'paid',
}

export interface TradeType {
	accountNumber: string;
	amount: number;
	createdAt: string;
	email: string;
	fromCurrency: string;
	network: string | null;
	phoneNumber: string;
	rate: number;
	receivedAmount: number;
	status: string;
	telegramLogin: string;
	toCurrency: string;
	userId: string;
	wallets: never[];
	__v: number;
	_id: string;
}