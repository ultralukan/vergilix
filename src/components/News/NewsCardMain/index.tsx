import { NewsType } from "@/types/api/news";
import styles from "./index.module.scss";
import ArrowIcon from '../../../../public/arrow.svg';

export const NewsCardMain = ({data}: {data: NewsType}) => {
  const image = data?.img || "./news-example.png";
  const title = data?.title || "Новое падение Bitcoin. Обзор рынка рынка криптовалют за неделю";

  const date = data?.date.split(" ");

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.image}>
          <img src={image} alt="news" />
        </div>
        <div className={styles.content}>
          <div className={styles.date}>
            <div className={styles.dateDay}>
              {date[0]}
            </div>
            <div className={styles.dateText}>
              <div>{date[1]}</div>
              <div>{date[2]}</div>
            </div>
          </div>
          <div className={styles.text}>
            {title}
          </div>
        </div>
        <ArrowIcon className={styles.icon}/>
      </div>
    </>
  )
}