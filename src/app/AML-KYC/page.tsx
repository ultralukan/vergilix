"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

interface ItemsType {
  content: string;
  label: string;
  subLabel?: string;
  list?: { label: string; content: string }[];
}

export default function AMLKYCPage() {
  const t = useTranslations("AML-KYC");
  const items = t.raw("items");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.content}>
        {items.map((item: ItemsType, index: number) => (
          <div key={index} className={styles.item}>
            <div className={styles.label}>{index + 1}. {item.label}</div>
            {item.subLabel && <div className={styles.subLabel}>{item.subLabel}</div>}
            {item.list && item.list.length > 0 && (
              <ul className={styles.content}>
                {item.list.map((el, i) => (
                  <li key={i}><b>{el.label}</b> {el.content}</li>
                ))}
              </ul>
            )}
            <div className={styles.content}>{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
