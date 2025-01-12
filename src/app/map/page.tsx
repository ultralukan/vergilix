"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import Link from "next/link";
import MapIcon from "../../../public/map.svg"

export default function Map() {
  const t = useTranslations('Map');


  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.main}>
        <div className={styles.info}>
          {/* <div className={styles.list}>
            <Link href={'/'} className={styles.listTitle}>{t("titleExchange")}</Link>
            <Link href={'/'} className={styles.item}>{t("BTC-EUR")}</Link>
            <Link href={'/'} className={styles.item}>{t("EUR-BTC")}</Link>
            <Link href={'/'} className={styles.item}>{t("BTC-USD")}</Link>
            <Link href={'/'} className={styles.item}>{t("USD-BTC")}</Link>
            <Link href={'/'} className={styles.item}>{t("BTC-RUB")}</Link>
            <Link href={'/'} className={styles.item}>{t("RUB-BTC")}</Link>
          </div> */}
          <div className={styles.list}>
            <Link href={'/'} className={styles.listTitle}>{t("titleMap")}</Link>
            <Link href={'/'} className={styles.item}>{t("Main")}</Link>
            <Link href={'/'} className={styles.item}>{t("Exchange")}</Link>
            <Link href={'/'} className={styles.item}>{t("News")}</Link>
            <Link href={'/'} className={styles.item}>{t("FAQ")}</Link>
            <Link href={'/'} className={styles.item}>{t("About")}</Link>
            <Link href={'/'} className={styles.item}>{t("Support")}</Link>
          </div>
          <div className={styles.list}>
            <Link href={'/'} className={styles.listTitle}>{t("titleTerms")}</Link>
            <Link href={'/'} className={styles.item}>{t("terms")}</Link>
            <Link href={'/'} className={styles.item}>{t("policy")}</Link>
            <Link href={'/'} className={styles.item}>{t("AML")}</Link>
          </div>
        </div>
        <div>

        </div>
      </div>
      <MapIcon className={styles.image}/>
    </div>
  );
}
