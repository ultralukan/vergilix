import { NewsType } from "@/types/api/news";
import styles from "./index.module.scss";
import ArrowIcon from '../../../../public/arrow.svg';

export const NewsCard = ({data}: {data: NewsType}) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.date}>{data.date}<ArrowIcon className={styles.icon}/></div>
        <div className={styles.title}>{data.title}</div>
      </div>

    </div>
  )
}