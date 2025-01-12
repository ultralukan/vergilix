"use client"

import { useTranslations } from "next-intl";
import BalanceIcon from "../../../public/balance.svg";
import styles from "./index.module.scss";
import { useAppSelector } from "@/store";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Balance() {
  const router = useRouter();
  const t = useTranslations('Balance');

  const user = useAppSelector((state) => state.auth.user)

  return(
    <>
      <h5>{t('title')}</h5>
      <div className={styles.card}>
        <BalanceIcon className={styles.icon}/>
        <div className={styles.text}>
          <p className={styles.textLabel}>{t('title')}:</p>
          <p className={styles.textBalance}>{user?.balance} &#8381;</p>
        </div>
      </div>
      <div className={styles.button}>
        <Button
          label={t("btnLabel")}
          type={"link"}
          onClick={() => window.open("https://vergilix.exchange/page2", "_blank")}
        />
      </div>
    </>
  )
}