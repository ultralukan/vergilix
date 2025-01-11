"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import LoginPortal from "../LoginPortal";
import { useAppDispatch, useAppSelector } from "@/store";
import { Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import classNames from "classnames";
import PersonIcon from "../../../public/person.svg"
import NavBarPortal from "../NavbarPortal";
import { ArrowDropDown } from "@mui/icons-material";

export default function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthLoading = useAppSelector((state) => state.auth.isAuthLoading);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuth = !!token && user;
  const router = useRouter();
  const location = usePathname();
  const isMain = location === '/';
  const isVerif = useAppSelector((state) => state.auth.isVerif);
  const dispatch = useAppDispatch();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const t = useTranslations("Header");

  const toggleLoginForm = () => {
    setIsLoginOpen((prev) => !prev);
  };

  const toggleNavBarForm = () => {
    setIsNavBarOpen((prev) => !prev);
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
      router.push('/');
    }
  };

  useEffect(() => {
    if(isVerif) {
      toggleLoginForm()
    }
  }, [isVerif])


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={classNames(styles.header, {[styles["header-main"]]: isMain})}>
      <div className={styles.main}>
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            alt={"logo"}
            width={160}
            height={50}
            className={styles.logo}
          />
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
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
      <div className={classNames(styles.buttons, {[styles["buttons-main"]]: isMain})}>
        <button className={styles.language}>EN</button>
        {!isAuthLoading && (
          <button
            className={classNames(styles.login, {[styles["login-hidden"]]: isAuth, [styles["login-main"]]: isMain})}
            onClick={!isAuth ? toggleLoginForm : toggleNavBarForm}
          >
            <PersonIcon className={styles.icon}/><span className={styles.profile}>{isAuth ? (user?.email || t("profile")) : t("login")}</span>
            {isAuth && <ArrowDropDown/>}
          </button>
        )}
        <button className={styles.menuToggle} onClick={toggleNavBarForm}>
          <Image src={"/burger.svg"} alt="logo" width="150" height="30" />
        </button>
      </div>
      {/* <div className={classNames(styles.buttonsMobile, {[styles["buttons-main"]]: isMain})}>
        {!isAuthLoading && (
          <button
            className={classNames(styles.login, {[styles["login-main"]]: isMain})}
            onClick={isAuth ? toggleDropDown : toggleLoginForm}
          >
            <PersonIcon className={styles.icon}/>
          </button>
        )}
        <button className={styles.menuToggle} onClick={toggleNavBarForm}>
          <Image src={"/burger.svg"} alt="logo" width="150" height="30" />
        </button>
      </div> */}
      <LoginPortal isOpen={isLoginOpen} onClose={toggleLoginForm}/>
      <NavBarPortal isOpen={isNavBarOpen} onClose={toggleNavBarForm} isAuth={isAuth} handleLogout={handleClick} handleLogin={toggleLoginForm}/>
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
        disableScrollLock={true}
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
