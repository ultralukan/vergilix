import styles from "./index.module.scss";

type ItemProps = {
  img: string;
  text?: string;
};

export default function AboutCard({ img, text, src }: ItemProps) {

  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <img src={src} alt={"icon"}/>
      </div>
      <div className={styles.text}>
        {text}
      </div>
    </div>
  );
}
