"use client"

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import {Mail, Telegram, X} from "@mui/icons-material";

export default function Footer() {
  const t = useTranslations('Footer');
  const location = usePathname();
  const isMain = location === '/';

  return(
    <footer className={classNames(styles.footer, {[styles["footer-main"]]: isMain})}>
      <div className={styles.content}>
        <ul className={styles.links}>
          <li className={classNames(styles.link, {[styles["link-selected"]]: location === '/terms'})}><Link href={'/terms'}>{t("terms")}</Link></li>
          <li className={classNames(styles.link, {[styles["link-selected"]]: location === '/privacy-policy'})}><Link href={'/privacy-policy'}>{t("policy")}</Link></li>
          <li className={classNames(styles.link, {[styles["link-selected"]]: location === '/AML-KYC'})}><Link href={'/AML-KYC'}>{t("AML")}</Link></li>
          <li className={classNames(styles.link, {[styles["link-selected"]]: location === '/support'})}><Link href={'/support'}>{t("support")}</Link></li>
          <li className={classNames(styles.link, {[styles["link-selected"]]: location === '/map'})}><Link href={'/map'}>{t("map")}</Link></li>
        </ul>
      </div>
      <div className={styles.contentSocial}>
        <div className={styles.contentSocialWrapper}>
          {/*<button className={styles.language}>EN</button>*/}
          <ul className={styles.social}>
            <li><Link href={'https://t.me/vergilixExchange'} target={"_blank"}><Telegram/></Link></li>
            <li><Link href={'https://x.com/Vergilix_'} target={"_blank"}><X sx={{scale: 0.8}}/></Link></li>
            <li><Link href={'/'}><Mail/></Link></li>
          </ul>
        </div>
        <div>© 2024 Vergilix</div>
      </div>
      <div className={classNames(styles["bgImage"], {[styles["bgImage-hidden"]]: !isMain})}>
        <video
          playsInline
          preload="metadata"
          loop
          autoPlay
          muted
        >
          <source src="/promo.mov" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </div>
      <img className={classNames(styles.bgImage, {[styles["bgImage-mobile"]]: true})} src="./video-image.png" alt={'video'}/>
    </footer>
  )
}