import { RateType } from "@/types/api/rates";

export const isFiat = (str: string) => ['USD', 'EUR', 'RUB', 'KGS'].includes(str);
export const filterRates = (str: string) => ['KGS'].includes(str);

export function groupRatesByTypeAndCurrency(rates: RateType[] = []) {
  const grouped = {
    FROM: {} as Record<string, RateType[]>,
    TO: {} as Record<string, RateType[]>,
  };
	
	if(rates.length) {
		rates.forEach((rate) => {
			const valueFrom = rate.fromCurrency;
			const valueTo = rate.toCurrency;
			if(filterRates(valueFrom) || filterRates(valueTo)) return;
			if (!grouped.FROM[valueFrom]) {
				grouped.FROM[valueFrom] = [];
			}
			grouped.FROM[valueFrom].push({ ...rate, valueFrom });
	
			if (!grouped.TO[valueTo]) {
				grouped.TO[valueTo] = [];
			}
			grouped.TO[valueTo].push({ ...rate, valueTo });
		});
	
	}
  return grouped;
}


export function getIconPath(value: string) {
	try {
		const lower = value.toLocaleLowerCase();
		const folder = isFiat(value) ? 'black' : 'icon';
		// return `/${folder}/${lower}.png`
		return `/new-icons/${value}.png`
	} catch{
		return null
	}
}

export function getCurrenciesOptions(rates: RateType[] = []) {
	const grouped: { value: number, label: string, icon: string | null }[] = []

	if(rates.length) {
		rates.forEach((rate, index) => {
			const valueTo = rate.toCurrency;
			if (!grouped.map((el) => el.label).includes(valueTo)) {
				grouped.push({
					value: index,
					label: valueTo,
					icon: getIconPath(valueTo)
				})
			}
		});
	}
	return grouped.sort((a, b) => a.label.localeCompare(b.label));
}

export const getStakingIncome = (amount: number, month: number) => {
	const percentages: Record<number, number> = {
		3: 22,
		6: 28,
		9: 32,
		12: 36,
	};

	const percentage = percentages[month];
	const totalIncome = amount * (percentage / 100);

	return ({
		totalIncome: Number(totalIncome.toFixed(2)),
		totalAmount: Number((Number(totalIncome) + Number(amount)).toFixed(2)),
		percentage
	})
}