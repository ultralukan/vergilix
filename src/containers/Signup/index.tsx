import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import { useMemo, useRef, useState, useEffect } from "react";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Captcha } from "@/components/Captcha";
import ReCAPTCHA from "react-google-recaptcha";
import { createValidationSchema } from "./validation";
import { useRegisterMutation, useResendVerificationMutation } from "@/api/auth";
import Link from "next/link";
import { ApiError } from "@/types/error";
import Image from "next/image";
import { InputAdornment } from "@mui/material";

type Props = {
  isRegistered: boolean,
  setIsRegistered: (value: boolean) => void,
  setSelected: (value: string) => void,
}

export default function SignupForm({isRegistered, setIsRegistered, setSelected}: Props) {
  const t = useTranslations('Login');
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [register] = useRegisterMutation();
  
  // Состояние для отсчета времени для повторной отправки
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [resendVerif] = useResendVerificationMutation();

  // Таймер отсчета времени
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); // Очистка интервала при размонтировании
    }
    if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false); // Останавливаем таймер, когда время вышло
    }
  }, [isTimerRunning, timeLeft]);

  const handleSubmit = async (
    values: { email: string; password: string; confPassword: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setErrorMessage('');
      setIsRegistered(false);
      setIsLoading(true);
      const { email, password } = values;
      const response = await register({ email, password, captchaToken }).unwrap();
      if (response) {
        setIsRegistered(true);
        setPassword("");
        setConfPassword("");
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
      setCaptchaToken('');
    } finally {
      setIsLoading(false);
      if (captchaRef.current) {
        captchaRef.current.reset();
      }
    }
  };

  const handleSubmitVerif = async () => {
    if(isTimerRunning) return;
    try {
      // setErrorMessage('');
      // setIsLoading(true);
      setIsTimerRunning(true);
      setTimeLeft(60);
      const response = await resendVerif({ email }).unwrap();
      if (response) {
        setIsTimerRunning(true);
      }
    } catch (error: unknown) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;
        if ([400, 404, 500].includes(status)) {
          setErrorMessage(a(`resendVerif${status}`));
        } else {
          setErrorMessage("An unexpected error occurred");
        }
      }
    } finally {
      setIsLoading(false);
      if (captchaRef.current) {
        captchaRef.current.reset();
      }
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token || "");
  };

  const validationSchema = useMemo(() => createValidationSchema(e), [e]);

  const initialValues = useMemo(
    () => ({
      email: email,
      password: password,
      confPassword: confPassword,
      captchaToken: captchaToken,
    }),
    [email, password, captchaToken, confPassword]
  );

  return (
    <>
      {!isRegistered ? (
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
                name={'email'}
                type="email"
                value={email}
                setValue={setEmail}
                required
              />
              <Input
                label={t('password')}
                name={'password'}
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
                          onClick={() => setHidePassword((prev) => !prev)}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <Input
                label={t('confPassword')}
                name={'confPassword'}
                type={hidePassword ? "password" : "text"}
                value={confPassword}
                setValue={setConfPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment className={styles.adornment} position="end">
                      {confPassword && (
                        <Image
                          src={!hidePassword ? "/eye-hidden.png" : "/eye.png"}
                          width={30}
                          height={30}
                          alt="showPassword"
                          onClick={() => setHidePassword((prev) => !prev)}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <div className={styles.captcha}>
                <Captcha ref={captchaRef} onChange={handleRecaptchaChange} />
              </div>
              <div className={styles.button}>
                <Button
                  isLoading={isLoading}
                  disabled={!captchaToken || isLoading}
                  type="submit"
                  label={t('signupFormBtn')}
                />
              </div>
              <div className={styles.terms}>
                {t('termsMessage')}{' '}
                <Link href={"/"}>{t('terms')}</Link> {t('and')}{' '}
                <Link href={"/"}>{t('policy')}</Link>
              </div>
              {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : null}
            </Form>
          )}
        </Formik>
      ) : (
        <div className={styles.successMessage}>
          <img src="./home.png" alt="homeIcon" />
          <h5>{t("registerSuccessTitle")}</h5>
          <p>{t('registerSuccessText')}</p>
          <div className={styles.resendedVerif}>
            <p className={styles.resendedVerifTitle}>{t('registerSendVerif')}</p>
            <p
              className={styles.resendedVerifBtn}
              onClick={handleSubmitVerif}
              style={{ cursor: (isTimerRunning && !isLoading) ? 'not-allowed' : 'pointer', textDecoration: (isTimerRunning && !isLoading) ? 'none' : 'underline'}}
            >
              {isTimerRunning ? `${timeLeft}` : t('registerSendVerifBtn')}
            </p>
          </div>
          <div className={styles.button}>
            <Button
              label={t('registerSuccessBtn')}
              onClick={() => {
                setIsRegistered(false);
                setSelected('login');
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}