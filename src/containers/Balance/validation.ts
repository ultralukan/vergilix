import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType, amount: number,) => {
  return Yup.object().shape({
    phone: Yup.string()
      .typeError(e("typeError"))
      .required(e("phoneRequired")),
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
