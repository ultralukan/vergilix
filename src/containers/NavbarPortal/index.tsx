import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import LoginForm from "../LoginForm";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import SignupForm from "../Signup";
import ResetForm from "../ResetForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import {Mail, Telegram, WhatsApp, X} from "@mui/icons-material";
import { usePathname } from "next/navigation";

type Props = {
  isOpen: boolean,
  onClose: () => void;
  isAuth: boolean,
  handleLogout: () => void;
  handleLogin: () => void;
}

export default function NavBarPortal({ isOpen, onClose, isAuth, handleLogout, handleLogin}: Props) {
  const f = useTranslations('Footer');
  const h = useTranslations('Header');
  const pathName = usePathname();

  const handleClose = () => {
    onClose();
  }


  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("body-lock");
    } else {
      document.body.classList.remove("body-lock");
    }
    return () => {
      document.body.classList.remove("body-lock");
    };
  }, [isOpen]);


  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`}>
      <div className={styles.panel}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <div className={styles.content}>
        <div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {
              isAuth ? (
              <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/profile'})} onClick={handleClose}>
                <Link href={"/profile"}>{h("profile")}</Link>
              </li>
              ) : (
              <li className={styles.link} onClick={() => {handleLogin(); handleClose()}}>
                {h("login")}
              </li>
              )
            }
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/'})} onClick={handleClose}>
              <Link href={"/"}>{h("exchange")}</Link>
            </li>
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/about'})} onClick={handleClose}>
              <Link href={"/about"}>{h("about")}</Link>
            </li>
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/news'})} onClick={handleClose}>
              <Link href={"/news"}>{h("news")}</Link>
            </li>
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/faq'})} onClick={handleClose}>
              <Link href={"/faq"}>{h("faq")}</Link>
            </li>
            {
              isAuth && (
              <li className={styles.link} onClick={() => {handleLogout(); handleClose()}}>
                {h("logout")}
              </li>
              )
            }
          </ul>
        </nav>
        <ul className={styles.links}>
          <li onClick={handleClose}><Link href={'/terms'}>{f("terms")}</Link></li>
          <li onClick={handleClose}><Link href={'/privacy-policy'}>{f("policy")}</Link></li>
          <li onClick={handleClose}><Link href={'/AML-KYC'}>{f("AML")}</Link></li>
          <li onClick={handleClose} className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/support'})}><Link href={'/support'}>{f("support")}</Link></li>
          <li onClick={handleClose} className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/map'})}><Link href={'/map'}>{f("map")}</Link></li>
        </ul>
        </div>
        <ul className={styles.social}>
          <li><Link href={'https://t.me/vergilixExchange'} target={"_blank"}><Telegram/></Link></li>
          <li><Link href={'https://x.com/Vergilix_'} target={"_blank"}><X/></Link></li>
          <li><Link href={'/'}><Mail/></Link></li>
        </ul>
        </div>
      </div>
      <div className={styles.backdrop} onClick={handleClose}></div>
    </div>
  );
}