import * as Yup from 'yup';
import { TranslationsType } from '@/types/translations';

export const personalityValidationSchema = (t: TranslationsType) =>
  Yup.object().shape({
    name: Yup.string().required(t('required')).test(
      'no-trailing-spaces',
      t("noTrailingSpaces"),
      (value) => !value || value.trim() === value
    ),
    surname: Yup.string().required(t('required')).test(
      'no-trailing-spaces',
      t("noTrailingSpaces"),
      (value) => !value || value.trim() === value
    ),
    patronymic: Yup.string().nullable().test(
      'no-trailing-spaces',
      t("noTrailingSpaces"),
      (value) => !value || value.trim() === value
    ),
    birthday: Yup.date().required(t('required')).typeError(t('typeError')),
    place: Yup.string().required(t('required')),
    phone: Yup.string().matches(/^\d+$/, t('typeError')).min(2, t('typeError')).required(t('required')),
  });

export const documentValidationSchema = (t: TranslationsType) =>
  Yup.object().shape({
    documentNumber: Yup.string().required(t('required')),
    documentDate: Yup.date().required(t('required')).typeError(t('typeError')),
    documentPlace: Yup.string().required(t('required')),
    inn: Yup.string().matches(/^\d+$/, t('typeError')).min(2, t('typeError')),
  });

export const addressValidationSchema = (t: TranslationsType) =>
  Yup.object().shape({
    country: Yup.string().required(t('required')),
    region: Yup.string(),
    city: Yup.string().required(t('required')),
    street: Yup.string().required(t('required')),
    house: Yup.string().required(t('required')),
    corps: Yup.string().nullable(),
    appart: Yup.string().nullable(),
    homeIndex: Yup.string().matches(/^\d+$/, t('typeError')).nullable(),
  });

export const photoValidationSchema = (t: TranslationsType) =>
  Yup.object().shape({
    file: Yup.mixed().nullable().required(t('required')),
  });


  export const getValidationSchema = (step: number, t: TranslationsType) => {
    switch (step) {
      case 0:
        return personalityValidationSchema(t);
      case 1:
        return documentValidationSchema(t);
      case 2:
        return addressValidationSchema(t);
      case 3:
        return photoValidationSchema(t);
      default:
        return Yup.object().shape({});
    }
  };
  