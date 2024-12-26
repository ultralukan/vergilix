import * as Yup from 'yup';

export const createValidationSchema = (e: any) => {

  return Yup.object().shape({
    email: Yup.string().email(e("typeError")).required(e("required")),
  });
};
