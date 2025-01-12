"use client"

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Mail, Telegram, WhatsApp } from "@mui/icons-material";

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
          <li><Link href={'/support'}>{t("support")}</Link></li>
          <li><Link href={'/map'}>{t("map")}</Link></li>
        </ul>
      </div>
      <div className={styles.contentSocial}>
        <div className={styles.contentSocialWrapper}>
          <button className={styles.language}>EN</button>
          <ul className={styles.social}>
            <li><Link href={'/'}><Telegram/></Link></li>
            <li><Link href={'/'}><WhatsApp/></Link></li>
            <li><Link href={'/'}><Mail/></Link></li>
          </ul>
        </div>
        <div>© 2024 Vergilix</div>
      </div>
      <div className={classNames(styles["bgImage"], {[styles["bgImage-hidden"]]: !isMain})}>
        <video
          controls
          preload="metadata"
          loop
          autoPlay
          muted
          className={styles.bgImage}
        >
          <source src="/promo.mov" type="video/mp4" />
            Your browser does not support the video tag.
        </video>    
      </div>
    </footer>
  )
}