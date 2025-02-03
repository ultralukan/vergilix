"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import LoginPortal from "../LoginPortal";
import { useAppDispatch, useAppSelector } from "@/store";
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
  const pathName = usePathname();
  const isMain = pathName === '/';
  const isVerif = useAppSelector((state) => state.auth.isVerif);
  const dispatch = useAppDispatch();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollTop && currentScroll > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <header
      className={`${!isMain ? styles["header-wrapper"] : ""} ${isHidden ? styles.hidden : ""}`}
    >
    <div className={classNames(styles.header, {[styles["header-main"]]: isMain,})}>
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
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/'})}>
              <Link href={"/"}>{t("exchange")}</Link>
            </li>
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/about'})}>
              <Link href={"/about"}>{t("about")}</Link>
            </li>
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/news'})}>
              <Link href={"/news"}>{t("news")}</Link>
            </li>
            <li className={classNames(styles.link, {[styles["link-selected"]]: pathName === '/faq'})}>
              <Link href={"/faq"}>{t("faq")}</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={classNames(styles.buttons, {[styles["buttons-main"]]: isMain})}>
        <button className={styles.language}>EN</button>
        {!isAuthLoading && (
          <>
          {
            isAuth && (
              <Link
                className={classNames(styles.profile, styles["profile-mobile"], {[styles["profile-mobile-selected"]]: pathName === '/profile'})}
                href={"/profile"}
              >
                <PersonIcon className={styles.icon}/>
              </Link>  
            )
          }        
          <button
            className={classNames(styles.login, {[styles["login-hidden"]]: isAuth, [styles["login-main"]]: isMain})}
            onClick={!isAuth ? toggleLoginForm : toggleNavBarForm}
          >
            <PersonIcon className={styles.iconDesc}/><span className={styles.profile}>{isAuth ? (user?.email || t("profile")) : t("login")}</span>
            {isAuth && <ArrowDropDown/>}
          </button>
          </>
        )}
        <button className={styles.menuToggle} onClick={toggleNavBarForm}>
          <Image src={"/burger.svg"} alt="logo" width="150" height="30" />
        </button>
      </div>
      <LoginPortal isOpen={isLoginOpen} onClose={toggleLoginForm}/>
      <NavBarPortal isOpen={isNavBarOpen} onClose={toggleNavBarForm} isAuth={isAuth} handleLogout={handleClick} handleLogin={toggleLoginForm}/>
    </div>
    </header>
  );
}
