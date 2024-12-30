import { TranslationsType } from '@/types/translations';
import * as Yup from "yup";

export const createValidationSchema = (e: TranslationsType, amount?: number) => {
  return Yup.object().shape({
    amountFrom: Yup.number()
      .typeError(e("typeError"))
      .required(e("required"))
      .min(0.000000000001, e("typeError"))
      .test("amountFrom-greater", e("amountFromLessThanAmountError"), function (value) {
        return value <= amount;
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
