import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType, amount: number,) => {
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
    currency: Yup.object()
      .shape({
        value: Yup.string().required('Обязательное поле'),
        label: Yup.string().required('Обязательное поле'),
      })
      .nullable()
      .required('Обязательное поле'),
    month: Yup.number()
      .required(e("required"))
  });
};
