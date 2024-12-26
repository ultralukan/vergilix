"use client"

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import { useMemo, useRef, useState } from "react";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Captcha } from "@/components/Captcha";
import ReCAPTCHA from "react-google-recaptcha";
import { createValidationSchema } from "./validation";
import { useAppDispatch } from "@/store";
import { useRegisterMutation } from "@/api/auth";
import { setToken } from "@/store/slices/authSlice";
import Cookies from 'js-cookie';
import { ApiError } from "next/dist/server/api-utils";

export default function ResetForm() {
  const t = useTranslations('Login');
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();
  
  const handleSubmit = async (
    values: { email: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(true);
      const { email } = values;
      const response = await register({ email }).unwrap();
      if (response) {
        setSuccessMessage(a("registerSuccess"));
        resetForm();
      }
    } catch (error: unknown) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;
    
        if (status === 400 || status === 401) {
          setErrorMessage(a("registerError"));
        } else {
          setErrorMessage('An unexpected error occurred');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  const initialValues = useMemo(() => ({
    email: email,
  }), [email])

  return(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        {() => (
          <Form className={styles.form}>
            <h5 className={styles.title}>{t("reset")}</h5>
            <p className={styles.text}>{t('resetText')}</p>
            <Input
              label={t('email')}
              name={'email'}
              type="email"
              value={email}
              setValue={setEmail}
            />
            <div className={styles.button}>
              <Button disabled={isLoading} type="submit" label={t('resetBtn')}/>
            </div>
            {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : successMessage ? <div className={styles.successMessage}>{successMessage}</div> : null}
          </Form>
        )}
      </Formik>
  )
}