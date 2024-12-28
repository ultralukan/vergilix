"use client"

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import Link from "next/link";
import { NewsCardMain } from "@/components/News/NewsCardMain";
import { NewsCard } from "@/components/News/NewsCard";
import { formatDateNoTime } from "@/services/dates";
import { useAppSelector } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { CustomPagination } from "@/components/CustomPagination";

const news = [
  {
    "_id": "1",
    "title": "Заголовок 1",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "2",
    "title": "Заголовок 2",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "3",
    "title": "Заголовок 3",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "4",
    "title": "Заголовок 4",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "5",
    "title": "Заголовок 5",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "6",
    "title": "Заголовок 6",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "7",
    "title": "Заголовок 7",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  },
  {
    "_id": "8",
    "title": "Заголовок 8",
    "content": "Содержание новости 3",
    "date": "2024-12-17T14:00:00.000Z",
    "img": "/news-example.png"
  }
]

export default function News() {
  const t = useTranslations('News');
  const lang = useAppSelector((state) => state.auth.language);
  // const {data: news = []} = useGetNewsQuery();

  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if(news.length) {
      setTotalPages(Math.ceil(news.length / pagination.pageSize))
    }
  }, [news, pagination.pageSize])

  const preparedNews  = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
  
    return [...news.slice(startIndex, endIndex)];
  }, [news, pagination.pageIndex, pagination.pageSize]);
  

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.mainNews}>
        {preparedNews.length > 0 && preparedNews.slice(0, 2).map((item) => (
          <Link key={item._id} href={`/news/${item._id}`} className={styles.cardMain}>
            <NewsCardMain data={{...item, date: formatDateNoTime(item.date)[lang].monthName}} />
          </Link>
        ))}
      </div>
      <div className={styles.otherNews}>
        {preparedNews.length > 2 && preparedNews.slice(2).map((item) => (
          <Link key={item._id} href={`/news/${item._id}`} className={styles.cardSecondary}>
            <NewsCard data={{...item, date: formatDateNoTime(item.date)[lang].noTime}} />
          </Link>
        ))}
      </div>
      <CustomPagination pagination={pagination} setPagination={setPagination} totalPages={totalPages}/>
    </div>
  );
}
