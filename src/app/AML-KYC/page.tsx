"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import classNames from "classnames";

interface ItemType {
  label?: string;
  subLabel?: string;
  content?: string;
  subContent?: string;
  items?: ItemType[];
}

const RecursiveItemList = ({ items }: { items: ItemType[] }) => {
  return (
    <ul className={styles.subContent}>
      {items.map((item, index) => (
        <li key={index} className={classNames({[styles["subContent-item"]]: item.items?.length && item?.label})}>
          {item.label && <b>{item.label}</b>}
          {item.content && <span> {item.content}</span>}
          {item.subContent && <b> {item.subContent}</b>}
          {item.items && item.items.length > 0 && <RecursiveItemList items={item.items} />}
        </li>
      ))}
    </ul>
  );
};

export default function AMLKYCPage() {
  const t = useTranslations("AML-KYC");
  const items = t.raw("items");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <ul className={styles.content}>
        {items.map((item: ItemType, index: number) => (
          <li key={index} className={styles.item}>
            <div className={styles.label}>
              {index + 1}. {item.label}
            </div>
            {item.subLabel && <div className={styles.subLabel}>{item.subLabel}</div>}
            {item.content && <div className={styles.content}>{item.content}</div>}
            {item.items && item.items.length > 0 && <RecursiveItemList items={item.items} />}
          </li>
        ))}
      </ul>
    </div>
  );
}