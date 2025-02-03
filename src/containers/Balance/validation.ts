import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSBPSchema = (e: TranslationsType, amount: number) => {
  return Yup.object().shape({
    phone: Yup.string()
      .typeError(e("typeError"))
      .required(e("phoneRequired"))
      .test('phone-format', e("typeError"), function(value) {
        if (!value) return true;
        const format1 = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
        const format2 = /^7\d{10}$/;
        return format1.test(value) || format2.test(value);
      }),
    amount: Yup.number()
      .typeError(e("typeError"))
      .required(e("required"))
      .min(0.01, e("typeError"))
      .test({
        name: "amountFrom-greater",
        message: e("amountFromLessThanAmountError"),
        test: function (value) {
          return value <= amount;
        },
      }),
    bank: Yup.string()
      .required(e("required")),
  });
};

export const createValidationCardSchema = (e: TranslationsType, amount: number) => {
  return Yup.object().shape({
    amount: Yup.number()
      .typeError(e("typeError"))
      .required(e("required"))
      .min(0.01, e("typeError"))
      .test({
        name: "amountFrom-greater",
        message: e("amountFromLessThanAmountError"),
        test: function (value) {
          return value <= amount;
        },
      }),
    cardNumber: Yup.string()
      .required(e("required"))
      .matches(/^\d{4} \d{4} \d{4} \d{4}$/, e("typeError"))
      .test('luhn-check', e("typeError"), function(value) {
        if (!value) return true;
        return luhnCheck(value);
      }),
  });
};

const luhnCheck = (cardNumber: string) => {
  const sanitized = cardNumber.replace(/\s+/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};