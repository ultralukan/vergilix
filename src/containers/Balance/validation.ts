import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType, amount: number,) => {
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
      .required(e("required"))
  });
};
