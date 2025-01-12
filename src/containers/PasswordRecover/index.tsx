"use client"

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { createValidationSchema } from "./validation";
import { useUpdateUserMutation } from "@/api/user";
import { ApiError } from "@/types/error";

function sanitizeHTML(content: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = content;
  return tempDiv.innerHTML;
}

export default function PasswordRecover() {
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [edit, setEdit] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('FormPassRecovery');
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [update] = useUpdateUserMutation();

  const faqItems = t.raw("items");
  

  const handleSubmit = async (values, { resetForm }) => {
    if (edit) return;
    
    try {
      setSuccessMessage("");
      setErrorMessage("");
      setIsLoading(true);
      const { password } = values;
      const response = await update({ password }).unwrap();
  
      if (response) {
        resetForm();
        setSuccessMessage(t("successMessage"));
        setEdit(true);
        setPasswordConf("");
        setPassword("");
      }
    } catch (error) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;
  
        if ([400, 401, 404, 500].includes(status)) {
          setErrorMessage(a(`updateUser${status}`));
        } else {
          setErrorMessage("An unexpected error occurred");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = useMemo(() => {
    return({
      password: password,
      passwordConf: passwordConf,
    })
  }, [password, passwordConf])

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  return(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        <Form className={styles.form}>
        {errorMessage ? <h5 className={styles.titleError}>{errorMessage}</h5> : successMessage ? <h5 className={styles.title}>{t('successMessage')}</h5> : null}
          <div className={styles.main}>
            <div className={styles.fields}>
              <h5>{t('title')}</h5>
              <div className={styles.formItems}>
                <div className={styles.formItem}>
                  <Input
                    label={t('password')}
                    name='password'
                    type="password"
                    value={password}
                    setValue={setPassword}
                    disabled={edit}
                    required
                  />
                </div>
                <div className={styles.formItem}>
                  <Input
                    label={t('repeatPassword')}
                    name='passwordConf'
                    type="password"
                    value={passwordConf}
                    setValue={setPasswordConf}
                    disabled={edit}
                    required
                  />
                </div>
              </div>
            <div className={styles.button}>
              <Button
                label={edit ? t("formEdit") : t("formSave")}
                type={edit ? "button" : "submit"}
                isLoading={isLoading}
                disabled={isLoading}
                onClick={(e) => {
                  if (edit) {
                    e.preventDefault();
                    setEdit(false);
                  }
                }}
              />
            </div>
            </div>
            <div className={styles.rules}>
              <h5>{t('rulesTitle')}</h5>
              <ul>
              {faqItems.map((item: { content: string }, index: number) => (
                <li>{item.label}</li>
              ))}
              </ul>
            </div>
          </div>
          <img className={styles.image} src="./lock.svg"/>
        </Form>
      </Formik>
  )
}