"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";


export default function Terms() {
  const t = useTranslations("terms");
  const items = t.raw("items");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.content}>
        {items.map((item: { content: string, label: string }, index: number) => {
          return(
            <div key={index} className={styles.item}>
              <div className={styles.label}>{index + 1}. {item.label}</div>
              <div className={styles.content}>{item.content}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
