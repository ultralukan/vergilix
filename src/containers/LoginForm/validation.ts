import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType) => {

  return Yup.object().shape({
    email: Yup.string().email(e("typeError")).required(e("required")),
    password: Yup.string().required(e("required")),
  });
};
