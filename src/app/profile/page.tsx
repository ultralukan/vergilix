"use client"

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useState } from "react";
import classNames from "classnames";
import ContactForm from "@/containers/ContactForm";
import PasswordRecover from "@/containers/PasswordRecover";
import VerificationForm from "@/containers/VerificationForm";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';

export default function Profile() {
  const t = useTranslations('Profile');
  const [selectedNav, setSelectedNav] = useState('contact')

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.main}>
        <div className={styles.links}>
          <ul>
            <li onClick={() => setSelectedNav('contact')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'contact'})}><PersonOutlineIcon className={styles.icon}/> {t("contact")}</li>
            <li onClick={() => setSelectedNav('verification')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'verification'})}><ShieldIcon className={styles.icon}/>{t("verification")}</li>
            <li onClick={() => setSelectedNav('change')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'change'})}><LockIcon className={styles.icon}/>{t("change")}</li>
          </ul>
        </div>
        <div className={styles.formWrapper}>
          {
            selectedNav === 'contact' ? <ContactForm/> : selectedNav === 'change' ? <PasswordRecover/> : selectedNav === 'verification' ? <VerificationForm/>  : null
          }
        </div>
      </div>
    </div>
  );
}
