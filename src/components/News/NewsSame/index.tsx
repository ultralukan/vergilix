import styles from "./index.module.scss";
import ArrowIcon from '../../../../public/arrow.svg';
import {NewsType} from "@/types/api/news";

export const NewsSameCard = ({data}: {data: NewsType}) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.date}>{data.date}</div>
        <div className={styles.title}>{data.title}</div>
      </div>
      <ArrowIcon className={styles.icon}/>
    </div>
  )
}