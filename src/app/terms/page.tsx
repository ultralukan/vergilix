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

const RecursiveItemList = ({ items, parentIndex }: { items: ItemType[], parentIndex?: number }) => {
  return (
    <ol className={styles.subContent}>
      {items.map((item, index) => (
        <li key={index} className={classNames({[styles["subContent-item"]]: item.items?.length && item?.content})}>
          {parentIndex && `${parentIndex}.${index + 1}. `}
          {item.content && <HtmlContent htmlString={item.content}/>}
          {item.items && item.items.length > 0 && <RecursiveItemList items={item.items} />}
        </li>
      ))}
    </ol>
  );
};

export default function TermsPage() {
  const t = useTranslations("terms");
  const items = t.raw("items");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <ul className={styles.content}>
        {items.map((item: ItemType, index: number) => (
          <li key={index} className={styles.item}>
            <span className={styles.label}>
              {index + 1}. {item.label}
            </span>
            {item.subLabel && <div className={styles.subLabel}>{item.subLabel}</div>}
            {item.content &&  <div className={styles.content}><HtmlContent htmlString={item.content}/></div>}
            {item.items && item.items.length > 0 && <RecursiveItemList parentIndex={index + 1} items={item.items} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

const HtmlContent = ({ htmlString }: {htmlString: string}) => {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};