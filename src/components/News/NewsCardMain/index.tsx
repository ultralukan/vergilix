import { NewsType } from "@/types/news";
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
            <div>
              <p>{date[1]}</p>
              <p>{date[2]}</p>
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