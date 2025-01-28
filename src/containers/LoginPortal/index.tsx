import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import LoginForm from "../LoginForm";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import SignupForm from "../Signup";
import ResetForm from "../ResetForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
  isOpen: boolean,
  onClose: () => void;
}

export default function SlideInPanel({ isOpen, onClose }: Props) {
  const t = useTranslations('Login');
  const [selected, setSelected] = useState('login')
  const [isReset, setIsReset] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleClose = () => {
    onClose();
    setIsReset(false);
    setIsRegistered(false);
    setSelected('login')
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
        {!!isReset && (
          <button className={styles.backButton} onClick={() => setIsReset(false)}>
            <ArrowBackIcon className={styles.backIcon}/>
          </button>
        )}
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <div className={styles.content}>
          <nav className={styles.nav}>
            <ul className={classNames(styles.list, { [styles.listReset]: isReset })}>
              { !isRegistered && !isReset && (
                <>
                 <li onClick={() => setSelected('login')} className={classNames(styles.item, { [styles.selected]: selected === 'login' })}>{t("loginForm")}</li>
                 <li onClick={() => setSelected('signup')} className={classNames(styles.item, { [styles.selected]: selected === 'signup' })}>{t("signupForm")}</li>
                </>
              )}
            </ul>
            <div className={classNames(styles.headerMobile)}>
              { 
                !isReset && (selected === 'login' ? t("loginForm") : t("signupForm"))
              }
            </div>
          </nav>
          <div className={styles.form}>
            {
              !isReset ? selected === 'login' && !isRegistered ? <LoginForm setIsReset={setIsReset}/> : <SignupForm isRegistered={isRegistered} setSelected={setSelected} setIsRegistered={setIsRegistered} handleClose={handleClose}/> : <ResetForm/>
            }
          </div>
          <div className={styles.registerMobile}>
            {
              !isRegistered && (selected === 'login' ? (
                <>
                  <div>{t("registerQuestionMobile")}</div>
                  <div className={styles.registerMobileTitle} onClick={() => setSelected('signup')}>{t("registerMobile")}</div>
                </>
              ) : (
                <>
                  <div>{t("loginQuestionMobile")}</div>
                  <div className={styles.registerMobileTitle} onClick={() => setSelected('login')}>{t("loginFormBtn")}</div>
                </>
              ))
            }
          </div>
          {!isRegistered && !isReset && (
            <>
              <img className={styles.image} src={"./person.png"} alt="person"/>
            </>
           )}   
        </div>
      </div>
      <div className={styles.backdrop} onClick={handleClose}></div>
    </div>
  );
}