import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import styles from "./index.module.scss";
import Link from "next/link";

const CookieConsentPopup = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Cookies");

  const handleAccept = () => {
    Cookies.set("cookieConsent", "accepted", { expires: 30 });
    setOpen(false);
  };

  const handleDecline = () => {
    window.open("https://ya.ru/", "_self");
  };

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (!cookieConsent) {
      setOpen(true);
    }
  }, []);

  return (
    <>
      {open && (
        <div className={styles.cookiePopup}>
          <div className={styles.popupContent}>
            <p className={styles.popupText}>
              {t("label")}{" "}
              <Link className={styles.link} href="/privacy-policy">
                {t("policy")}
              </Link>
            </p>
            <div className={styles.popupActions}>
              <Button
                onClick={handleDecline}
                color="error"
                variant="outlined"
                sx={{
                  margin: "0 8px",
                  textTransform: "none",
                  "&:hover": {
                    filter: "brightness(0.9)",
                  },
                  minWidth: '150px',
                  fontSize: "16px",
                }}
              >
                {t("decline")}
              </Button>
              <Button
                onClick={handleAccept}
                color="primary"
                variant="contained"
                sx={{
                  margin: "0 8px",
                  textTransform: "none",
                  backgroundColor: "#71E0C1",
                  fontSize: "16px",
                  color: "#000",
                  "&:hover": {
                    filter: "brightness(1.05)",
                  },
                  minWidth: '150px',
                }}
              >
                {t("accept")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentPopup;
