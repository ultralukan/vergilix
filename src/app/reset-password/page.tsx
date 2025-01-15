'use client';

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import PasswordRecoverReset from "@/containers/PasswordRecoverReset";

function ResetPassword() {
  const t = useTranslations('ResetPassword');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <PasswordRecoverReset token={token}/>
    </div>
  );
}

const ResetPasswordlWrapper = () => {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordlWrapper;
