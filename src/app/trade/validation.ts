import { TranslationsType } from '@/types/translations';
import * as Yup from "yup";

export const createValidationSchemaStep1 = (e: TranslationsType) => {
  return Yup.object().shape({
    phone: Yup.number()
      .typeError(e("typeError"))
      .required(e("required")),
    telegram: Yup.string()
      .typeError(e("typeError"))
      .required(e("required")),
    address: Yup.string()
      .typeError(e("typeError"))
      .required(e("required")),
  });
};
