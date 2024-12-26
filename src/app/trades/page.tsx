"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { TradesTable } from "@/components/Table";

export default function Trades() {
  const t = useTranslations("Trades");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <TradesTable/>
    </div>
  );
}
