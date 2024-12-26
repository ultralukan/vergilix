"use client"

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useGetNewsQuery } from "@/api/news";

export default function News() {
  const t = useTranslations('News');
  const {data: news = []} = useGetNewsQuery(); 

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
    </div>
  );
}
