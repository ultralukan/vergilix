import { TranslationsType } from '@/types/translations';
import * as Yup from 'yup';

export const createValidationSchema = (e: TranslationsType) => {
  return Yup.object().shape({
    password: Yup.string()
      .min(8, e("passMinLength"))
      .max(20, e("passMaxLength"))
      .matches(/[a-z]/, e("passLowercase"))
      .matches(/[A-Z]/, e("passUppercase"))
      .matches(/\d/, e("passNumber"))
      .matches(/[%*\/\-+@#$&]/, e("passSpecialChar"))
      .required(e("required")),

    passwordConf: Yup.string()
      .oneOf([Yup.ref('password')], e("confPassword"))
      .required(e("required")),
  });
};
