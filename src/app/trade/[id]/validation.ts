import { TranslationsType } from '@/types/translations';
import * as Yup from "yup";

export const createValidationSchema = (e: TranslationsType) => {
  return Yup.object().shape({
    amount: Yup.string()
      .typeError(e("typeError"))
      .required(e("required")),
    accountNumber: Yup.string()
      .typeError(e("typeError"))
      .required(e("required")),
  });
};
