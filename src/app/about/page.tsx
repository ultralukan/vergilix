"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import AboutCard from "@/components/AboutCard";
import FeedbackForm from "@/containers/FeedbackForm";
import GraphIcon from "./../../../public/graph.png"
import ClockIcon from "./../../../public/clock.svg"
import HomeIcon from "./../../../public/home.svg"
import CommentIcon from "./../../../public/comment.svg"

export default function About() {
  const t = useTranslations("About");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.main}>
        <div className={styles.text}>
          <div className={styles.subTitle}>{t("subTitle")}</div>
          <div className={styles.desc}>
            <p>{t("desc1")}</p>
            <p>{t("desc2")}</p>
          </div>
        </div>
        <div className={styles.image}>
          <img src="/about.png" alt={"imgAlt"} />
          <div className={styles.overlay}>
            {t("imgTitle")
              .split(" ")
              .map((word, index) => (
                <div key={index}>
                <span>{word}</span>
                <hr/>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <AboutCard
            text={t("cardCurrency")}
            src={"./graph.png"}
          />
        </div>
        <div className={styles.card}>
          <AboutCard
            text={t("cardTime")}
            src={"./clock.png"}
          />
        </div>
        <div className={styles.card}>
          <AboutCard
            text={t("cardHouse")}
            src={"./home.png"}
          />
        </div>
        <div className={styles.card}>
          <AboutCard
            text={t("cardComment")}
            src={"./comment.png"}
          />
        </div>
      </div>
      <FeedbackForm/> 
    </div>
  );
}
