"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import DropDownItem from "@/components/DropdownItem";

function sanitizeHTML(content: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = content;
  return tempDiv.innerHTML;
}

export default function FAQ() {
  const t = useTranslations("FAQ");
  const faqItems = t.raw("items");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.content}>
        {faqItems.map((item: { content: string }, index: number) => (
          <DropDownItem
            key={index}
            label={item.label}
            text={sanitizeHTML(item.content)}
          />
        ))}
      </div>
      <img className={styles.image} src="./faq.svg" alt="FAQ Illustration" />
    </div>
  );
}
