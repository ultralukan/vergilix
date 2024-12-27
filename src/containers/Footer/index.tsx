"use client"

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export default function Footer() {
  const t = useTranslations('Footer');
  const location = usePathname();
  const isMain = location === '/';

  return(
    <footer className={classNames(styles.footer, {[styles["footer-main"]]: isMain})}>
      <div className={styles.content}>
        <ul className={styles.links}>
          <li><Link href={'/'}>{t("terms")}</Link></li>
          <li><Link href={'/'}>{t("policy")}</Link></li>
          <li><Link href={'/'}>{t("AML")}</Link></li>
          <li><Link href={'/'}>{t("support")}</Link></li>
          <li><Link href={'/map'}>{t("map")}</Link></li>
        </ul>
      </div>
      <div className={styles.content}>
        <div>© 2024 Vergilix</div>
      </div>
    </footer>
  )
}