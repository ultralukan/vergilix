import { TranslationsType } from '@/types/translations';
import * as Yup from "yup";

export const createValidationSchema = (e: TranslationsType, amount?: number, isFiat?: boolean) => {
  return Yup.object().shape({
    amountFrom: Yup.number()
      .typeError(e("typeError"))
      .required(e("required"))
      .min(0.000000000001, e("typeError"))
      .test({
        name: "amountFrom-greater",
        message: e("amountFromLessThanAmountError"),
        test: function (value) {
          if (!isFiat) return true;
          return value <= amount;
        },
      })
      .test({
        name: "amountFrom-min",
        message: e("amountFromLessMinimum"),
        test: function (value) {
          if (!isFiat) return true;
          return value >= 25000;
        },
      }),
    amountTo: Yup.number()
      .typeError(e("typeError"))
      .min(0.000000000001, e("typeError"))
      .required(e("required")),
    selectedItemFrom: Yup.object()
      .required(e("required")),
    selectedItemTo: Yup.object()
      .required(e("required")),
  });
};
