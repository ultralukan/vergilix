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
import Image from "next/image";

type Props = {
  setIsReset: (value: boolean) => void,
}

export default function LoginForm({setIsReset}: Props) {
  const t = useTranslations('Login');
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [hidePassword, setHidePassword] = useState(true);
  
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
        if (status === 400) {
          setErrorMessage(a("loginError400"));
        } else if(status === 401) {
          setErrorMessage(a("loginError401"));
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
              required
            />
            <Input 
              label={t('password')}
              name='password'
              type={hidePassword ? "password" : "text"}
              value={password}
              setValue={setPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {password && (
                      <Image
                        src={!hidePassword ? "/eye-hidden.svg" : "/eye.svg"}
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
            <div className={styles.forgotMobile}>
              <button onClick={() => setIsReset(true)}>{t("forgotMobile")}</button>
            </div>
            <div className={styles.captcha}>
              <Captcha ref={captchaRef} onChange={handleRecaptchaChange} />
            </div>
            <div className={styles.button}>
              <Button isLoading={isLoading} disabled={!captchaToken || isLoading} label={t('loginFormBtn')} type="submit"/>
            </div>
            {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : null}
          </Form>
        )}
      </Formik>
  )
}