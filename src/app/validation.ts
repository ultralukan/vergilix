import { TranslationsType } from '@/types/translations';
import * as Yup from "yup";

export const createValidationSchema = (e: TranslationsType) => {
  return Yup.object().shape({
    amountFrom: Yup.number()
    .typeError(e("typeError"))
    .required(e("required")),
    amountTo: Yup.number()
      .typeError(e("typeError"))
      .required(e("required")),
    selectedItemFrom: Yup.object()
      .required(e("required")),
    selectedItemTo: Yup.object()
      .required(e("required")),
  });
};
