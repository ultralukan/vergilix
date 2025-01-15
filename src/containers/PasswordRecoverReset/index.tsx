"use client"

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { createValidationSchema } from "./validation";
import { useResetPasswordMutation } from "@/api/auth";
import { ApiError } from "@/types/error";
import ModalComponent from "@/components/Modal";
import { InputAdornment } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

function sanitizeHTML(content: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = content;
  return tempDiv.innerHTML;
}

export default function PasswordRecoverReset({token}) {
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [modal, setModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleOpen = () => setModal(true);
  
  const handleClose = () => {
    setModal(false);
    if(isSuccess) {
      router.push('/')
    }
  }


  const t = useTranslations('ResetPassword');
  const r = useTranslations('FormPassRecovery');
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [update] = useResetPasswordMutation();

  const faqItems = r.raw("items");

  const handleSubmit = async (values, { resetForm }) => {
    
    try {
      setSuccessMessage("");
      setErrorMessage("");
      setIsLoading(true);
      const { password } = values;
      const response = await update({ token, newPassword: password }).unwrap();
      if (response) {
        resetForm();
        setIsSuccess(true);
        handleOpen()
        setPasswordConf("");
        setPassword("");
      }
    } catch {
      setIsSuccess(false);
      handleOpen()
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
    <>
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

              <div className={styles.formItems}>
                <div className={styles.formItem}>
                  <Input
                    label={r('password')}
                    name='password'
                    type={hidePassword ? "password" : "text"}
                    value={password}
                    setValue={setPassword}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment className={styles.adornment} position="end">
                          {password && (
                            <Image
                              src={!hidePassword ? "/eye-hidden.png" : "/eye.png"}
                              width={30}
                              height={30}
                              alt="showPassword"
                              onClick={() => setHidePassword(prev => !prev)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className={styles.formItem}>
                  <Input
                    label={r('repeatPassword')}
                    name='passwordConf'
                    type={hidePassword ? "password" : "text"}
                    value={passwordConf}
                    setValue={setPasswordConf}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment className={styles.adornment} position="end">
                          {passwordConf && (
                            <Image
                              src={!hidePassword ? "/eye-hidden.png" : "/eye.png"}
                              width={30}
                              height={30}
                              alt="showPassword"
                              onClick={() => setHidePassword(prev => !prev)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
            <div className={styles.button}>
              <Button
                label={r("formSave")}
                type={"submit"}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
            </div>
            <div className={styles.rules}>
              <h5>{r('rulesTitle')}</h5>
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
      <ModalComponent 
        open={modal} 
        onClose={handleClose} 
        title={isSuccess ? t("success") : t("error")} 
        btnText={isSuccess ? t("btnSuccess") : t("btnError")}
        status={isSuccess}
      />
    </>
  )
}