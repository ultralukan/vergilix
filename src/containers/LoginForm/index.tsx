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
import { useLoginMutation } from "@/api/auth";
import { setToken } from "@/store/slices/authSlice";
import Cookies from 'js-cookie';
import { InputAdornment } from "@mui/material";
import { ApiError } from "@/types/error";

type Props = {
  setIsReset: (value: boolean) => void,
}

export default function LoginForm({setIsReset}: Props) {
  const t = useTranslations('Login');
  const e = useTranslations('Validation');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setErrorMessage('');
      setIsLoading(true);
      const { email, password } = values;
      const response = await login({ email, password, captchaToken }).unwrap();
      const { token } = response;
      if(token) {
        dispatch(setToken(token));
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
        window.open('/', '_self')
      }
    } catch (error: unknown) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;
    
        if (status === 400 || status === 401) {
          // setErrorMessage(apiMessageText[lang].login.POST[status as 400 | 401]);
        } else {
          setErrorMessage('An unexpected error occurred');
        }
      }
      setCaptchaToken('');
    } finally {
      setIsLoading(false);
      if(captchaRef.current) {
        captchaRef.current.reset();
      }
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token || "");
  };

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  const initialValues = useMemo(() => ({
    email: email,
    password: password,
    captchaToken: captchaToken
  }), [email, password, captchaToken])

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
            <Input
              label={t('email')}
              name='email'
              type="email"
              value={email}
              setValue={setEmail}
            />
            <Input 
              label={t('password')}
              name='password'
              type="password"
              value={password}
              setValue={setPassword}
              InputProps={{
                endAdornment: setIsReset && (
                  <InputAdornment className={styles.adornment} position="end">
                    <button onClick={() => setIsReset(true)}>{t("forgot")}</button>
                  </InputAdornment>
                ),
              }}
            />
            <div className={styles.captcha}>
              <Captcha ref={captchaRef} onChange={handleRecaptchaChange} />
            </div>
            <div className={styles.button}>
              <Button disabled={!captchaToken || isLoading} label={t('loginFormBtn')} type="submit"/>
            </div>
            <div className={styles.terms}>
              
            </div>
            {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : null}
          </Form>
        )}
      </Formik>
  )
}