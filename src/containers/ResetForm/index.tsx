"use client"

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { createValidationSchema } from "./validation";
import { useResetPasswordRequestMutation } from "@/api/auth";
import { ApiError } from "next/dist/server/api-utils";

export default function ResetForm() {
  const t = useTranslations('Login');
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPassword] = useResetPasswordRequestMutation();
  
  const handleSubmit = async (
    values: { email: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(true);
      const { email } = values;
      const response = await resetPassword({ email }).unwrap();
      if (response) {
        setSuccessMessage(a("resetPasswordSuccess"));
        resetForm();
      }
    } catch (error: unknown) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;
    
        if (status === 404) {
          setErrorMessage(a("resetPassword404"));
        } else {
          setErrorMessage(a("resetPassword500"));
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