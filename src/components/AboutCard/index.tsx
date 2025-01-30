import styles from "./index.module.scss";

type ItemProps = {
  src: string;
  text?: string;
};

export default function AboutCard({ text, src }: ItemProps) {

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
