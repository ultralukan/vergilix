'use client';

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useVerifyEmailMutation } from "@/api/auth";

function VerifyEmail() {
  const t = useTranslations('Map');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verify] = useVerifyEmailMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async (token: string) => {
      try {
        setErrorMessage("");
        setSuccessMessage("");
        const response = await verify(token).unwrap();
        if (response?.message) {
          setSuccessMessage('Your email has been verified!');
          setIsVerified(true);
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred. Please try again.');
        setIsVerified(true);
      }
    };

    if (token && !isVerified) {
      verifyEmail(token);
    }
  }, [token, verify, isVerified]);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Верификация</h2>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
    </div>
  );
}


const VerifyEmailWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
};

export default VerifyEmailWrapper;