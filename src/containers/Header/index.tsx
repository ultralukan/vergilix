"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import LoginPortal from "../LoginPortal";
import { useAppDispatch, useAppSelector } from "@/store";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

export default function Header() {
  // const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const isAuth = !!token;
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const t = useTranslations("Header");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleLoginForm = () => {
    setIsLoginOpen((prev) => !prev);
  };

  const toggleDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDropDown = () => {
    setAnchorEl(null);
  };



  const handleClick = () => {
    if (isAuth) {
      dispatch(logout());
      Cookies.remove("token");
      closeDropDown();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <Image
          src={"/logo.png"}
          alt={"logo"}
          width={160}
          height={50}
          className={styles.logo}
        />
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.link}>
              <Link href={"/"}>{t("exchange")}</Link>
            </li>
            <li className={styles.link}>
              <Link href={"/about"}>{t("about")}</Link>
            </li>
            <li className={styles.link}>
              <Link href={"/news"}>{t("news")}</Link>
            </li>
            <li className={styles.link}>
              <Link href={"/faq"}>{t("faq")}</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.buttons}>
        <button className={styles.language}>EN</button>
        {isHydrated && (
          <button
            className={styles.login}
            onClick={isAuth ? toggleDropDown : toggleLoginForm}
          >
            {isAuth ? t("profile") : t("login")}
          </button>
        )}
      </div>
      <LoginPortal isOpen={isLoginOpen} onClose={toggleLoginForm} />
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeDropDown}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem className={styles.menuItem} onClick={() => {router.push('/profile'); closeDropDown()}}>
          {t("profile")}
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={() => {router.push('/trades'); closeDropDown()}}>
          {t("trades")}
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={handleClick}>{t("logout")}</MenuItem>
      </Menu>
    </header>
  );
}
