import { RateType } from "@/types/rate";

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
		return `/${folder}/${lower}.png`
	}catch{
		return null
	}
}