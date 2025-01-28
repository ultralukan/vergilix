import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType) => {
  return Yup.object().shape({
    telegram: Yup.string()
      .typeError(e("typeError")),
    phone: Yup.string()
      .typeError(e("typeError"))
      .required(e("required"))
      .matches(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, e("typeError")),
    name: Yup.string()
      .typeError(e("typeError"))
      .required(e("required"))
      .test(
        'no-trailing-spaces',
        e("noTrailingSpaces"),
        (value) => !value || value.trim() === value
      ),
    surname: Yup.string()
      .typeError(e("typeError"))
      .required(e("required"))
      .test(
        'no-trailing-spaces',
        e("noTrailingSpaces"),
        (value) => !value || value.trim() === value
      ),
    patronymic: Yup.string()
      .typeError(e("typeError"))
      .test(
        'no-trailing-spaces',
        e("noTrailingSpaces"),
        (value) => !value || value.trim() === value
      ),
  });
};
