"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
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
import { useSearchParams } from "next/navigation";
import SavingsIcon from '@mui/icons-material/Savings';
import TradesComponent from "@/components/Trades/page";
import Staking from "@/containers/Staking";

export default function Profile() {
  const t = useTranslations('Profile');
  const [selectedNav, setSelectedNav] = useState('contact');
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['contact', 'trades', 'balance', 'staking', 'verification', 'change'].includes(tab)) {
      setSelectedNav(tab);
    }
  }, [searchParams]);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.main}>
        <div className={styles.links}>
          <ul>
            <li onClick={() => setSelectedNav('contact')}
                className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'contact'})}><PersonIcon
              className={styles.icon}/> {t("contact")}</li>
            <li onClick={() => setSelectedNav('trades')}
                className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'trades'})}><MapIcon
              className={styles.icon}/> {t("trades")}</li>
            <li onClick={() => setSelectedNav('balance')}
                className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'balance'})}><BalanceIcon
              className={styles.icon}/>{t("balance")}</li>
            <li onClick={() => setSelectedNav('staking')}
                className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'staking'})}><SavingsIcon
              className={styles.icon}/>{t("staking")}</li>
            <li onClick={() => setSelectedNav('verification')}
                className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'verification'})}>
              <ShieldIcon className={styles.icon}/>{t("verification")}</li>
            <li onClick={() => setSelectedNav('change')}
                className={classNames(styles.item, {[styles["item-selected"]]: selectedNav === 'change'})}><LockIcon
              className={styles.icon}/>{t("change")}</li>
          </ul>
        </div>
        <div className={styles.formWrapper}>
          {
            selectedNav === 'contact' ? <ContactForm/> : selectedNav === 'change' ?
              <PasswordRecover/> : selectedNav === 'verification' ? <VerificationForm/>  :  selectedNav === 'balance' ? <Balance/> : selectedNav === 'trades' ? <TradesComponent/> :  selectedNav === 'staking' ? <Staking/> : null
          }
        </div>
      </div>
    </div>
  );
}