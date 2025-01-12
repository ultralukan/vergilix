"use client"

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useState } from "react";
import classNames from "classnames";
import ContactForm from "@/containers/ContactForm";
import PasswordRecover from "@/containers/PasswordRecover";
import VerificationForm from "@/containers/VerificationForm";
import BalanceIcon from "../../../public/balance.svg";
import ShieldIcon from "../../../public/shield.svg";
import LockIcon from "../../../public/lock-profile.svg";
import PersonIcon from "../../../public/man-profile.svg";
import MapIcon from "../../../public/map.svg";
import Balance from "@/containers/Balance";
import { useRouter } from "next/navigation";
import Trades from "../trades/page";
import TradesComponent from "@/components/Trades/page";

export default function Profile() {
  const t = useTranslations('Profile');
  const [selectedNav, setSelectedNav] = useState('contact');
  const router = useRouter();

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.main}>
        <div className={styles.links}>
          <ul>
            <li onClick={() => setSelectedNav('contact')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'contact'})}><PersonIcon className={styles.icon}/> {t("contact")}</li>
            <li onClick={() => setSelectedNav('trades')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'trades'})}><MapIcon className={styles.icon}/> {t("trades")}</li>
            <li onClick={() => setSelectedNav('balance')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'balance'})}><BalanceIcon className={styles.icon}/>{t("balance")}</li>
            <li onClick={() => setSelectedNav('verification')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'verification'})}><ShieldIcon className={styles.icon}/>{t("verification")}</li>
            <li onClick={() => setSelectedNav('change')} className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'change'})}><LockIcon className={styles.icon}/>{t("change")}</li>
          </ul>
        </div>
        <div className={styles.formWrapper}>
          {
            selectedNav === 'contact' ? <ContactForm/> : selectedNav === 'change' ? <PasswordRecover/> : selectedNav === 'verification' ? <VerificationForm/>  :  selectedNav === 'balance' ? <Balance/> : selectedNav === 'trades' ? <TradesComponent/> : null
          }
        </div>
      </div>
    </div>
  );
}
