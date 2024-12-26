import { NewsType } from "@/types/news";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

type PropsType = {
  href: string,
  item: NewsType,
  isMain?: boolean
}

export default function NewsCard({href, isMain, item}: PropsType) {
  return(
    <Link href={href}>
      {isMain ? (
        <div>
          <Image src={item.img} alt="news" width={100} height={100} className={styles.image}/>  
        </div>  
      ): (
        <div>
        </div>  
      )}

    </Link>
  )
}