import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import FacebookIcon from "../../../public/facebook.svg"
import Link from "next/link";

export default function Footer() {
  const t = useTranslations('Footer');

  return(
    <footer className={styles.footer}>
      <div>
        <ul className={styles.links}>
          <li><Link href={'/'}>{t("terms")}</Link></li>
          <li><Link href={'/'}>{t("policy")}</Link></li>
          <li><Link href={'/'}>{t("AML")}</Link></li>
          <li><Link href={'/'}>{t("support")}</Link></li>
          <li><Link href={'/map'}>{t("map")}</Link></li>
        </ul>
      </div>
      <div>
        <ul>
          <li><Link href={'/'}></Link></li>
          <li><Link href={'/'}></Link></li>
          <li><Link href={'/'}></Link></li>
          <li><Link href={'/'}></Link></li>
        </ul>
        <div>© 2024 Vergilix</div>
      </div>
    </footer>
  )
}