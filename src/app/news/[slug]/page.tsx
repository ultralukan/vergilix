"use client"

import { useAppSelector } from "@/store";
import styles from "./page.module.scss";
import { NewsType } from "@/types/news";
import { formatDateNoTime } from "@/services/dates";
import DOMPurify from "isomorphic-dompurify";
import parse from 'html-react-parser';
import ArrowIcon from "../../../../public/arrow-short.svg"
import { useTranslations } from "next-intl";
import Link from "next/link";
import { NewsSameCard } from "@/components/News/NewsSame";

const dataEx: NewsType = {
  "_id": "1",
  "title": "Заголовок 1. Заголовок 3",
  "content": `<h4>Ethereum показал худший результат среди 10 крупнейших по капитализации монет, токен Synthetix Network подорожал на 40%, а только один альткоин потерял свыше 20% от цены</h4><p>Специально для «РБК-Крипто» компания Cindicator проанализировала ситуацию на рынке криптовалют.Альткоины показали боковое движение, стоимость Bitcoin снизилась, а худший результат среди крупнейших по капитализации цифровых денег продемонстрировал Ethereum.</p><div>Неделя для биткоина началась с падения ниже уровня $8000
18 сентября и попыток вернуться выше этого уровня в следующие два дня.</div><p> худший результат среди 10 крупнейших по капитализации монет, токен Synthetix Network подорож</p><div> худший результат среди 10 крупнейших по капитализации монет, токен Synthetix Network подорож</div>`,
  "date": "2024-12-17T14:00:00.000Z",
  "img": "/news-example.png"
}

// {data}: {data: NewsType}

export default function NewsDetailPage() {
  const t = useTranslations('News');
  const lang = useAppSelector((state) => state.auth.language);
  const data = {...dataEx, date: formatDateNoTime(dataEx.date)[lang].monthName};
  // const sameData = {...dataEx, date: formatDateNoTime(dataEx.date)[lang].noTime};
  const date = data?.date.split(" ");
  const image = data?.img || "./news-example.png";
  const title = data?.title.split(". ");
  const safeContent = DOMPurify.sanitize(data.content);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.date}>
          <div className={styles.dateDay}>
            {date[0]}
          </div>
          <div>
            <p className={styles.month}>{date[1]}</p>
            <p className={styles.year}>{date[2]}</p>
          </div>
        </div>
        <div className={styles.back}>
          <ArrowIcon className={styles.arrow}/>
          <div>
            {t("backBtn")}
          </div>
        </div>
      </div>
      {
        !!title.length && (
          <div className={styles.titles}>
            {title.map((el, index) => (
              <div key={index}>
                <h2>{el}</h2>
                <hr/>
              </div> 
            ))}
           </div> 
        )
      }
      <div className={styles.image}>
        <img src={image} alt="news" />
      </div>
      <div className={styles.content}>{parse(safeContent)}</div>
      {/* <div className={styles.otherNews}>
        <Link href={`/news/${sameData._id}`} className={styles.cardSecondary}>
          <NewsSameCard data={sameData} />
        </Link>
        <Link href={`/news/${sameData._id}`} className={styles.cardSecondary}>
          <NewsSameCard data={sameData} />
        </Link>        
      </div> */}
    </div>
  );
}
