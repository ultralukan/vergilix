"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import DropDownItem from "@/components/DropdownItem";

export default function FAQ() {
  const t = useTranslations('FAQ');

  const faqItems =Array.from({length: 5}, (_, i) => i + 1).map((el) => ({title: t(`title${el}`), text: t(`text${el}`)}));

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div>
        {
          faqItems.map((el, index) => <DropDownItem key={index} label={el.title} text={el.text}/>)
        }
      </div>
    </div>
  );
}
