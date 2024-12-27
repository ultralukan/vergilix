'use client';

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useVerifyEmailMutation } from "@/api/auth";
import ModalComponent from "@/components/Modal";

function VerifyEmail() {
  const t = useTranslations('EmailVerif');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [modal, setModal] = useState(false);
  const handleOpen = () => setModal(true);
  
  const handleClose = () => {
    setModal(false);
    router.push('/');
  }

  const [verify] = useVerifyEmailMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const hasRun = useRef(false);

  useEffect(() => {
    const verifyEmail = async (token: string) => {
      try {
        const response = await verify(token).unwrap();

        if (response?.message) {
          setIsVerified(true);
          setIsSuccess(true);
        }
      } catch {
        setIsVerified(true);
        setIsSuccess(false);
      }
    };
    
    if (token && !isVerified && !hasRun.current) {
      hasRun.current = true;
      verifyEmail(token);
      handleOpen();
    }
  }, [token, verify, isVerified, t]);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Верификация</h2>
        {
          (isVerified === true || isVerified === false) ? (
            <ModalComponent 
              open={modal} 
              onClose={handleClose} 
              title={isSuccess ? t("success") : t("error")} 
              btnText={isSuccess ? t("btnSuccess") : t("btnError")}
              status={isSuccess}
            />
          ) : null
        }
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
