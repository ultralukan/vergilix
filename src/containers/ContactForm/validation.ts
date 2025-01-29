import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType) => {
  return Yup.object().shape({
    telegram: Yup.string()
      .typeError(e("typeError")),
    phone: Yup.string()
      .typeError(e("typeError"))
      .required(e("required"))
      .test('phone-format', e("typeError"), function(value) {
        if (!value) return true;
        const format1 = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
        const format2 = /^7\d{10}$/;
        return format1.test(value) || format2.test(value);
      }),
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
