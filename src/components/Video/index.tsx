import { useEffect } from "react";
import styles from "./index.module.scss";

export const VideoComponent = ({ fadeOut }: { fadeOut: boolean }) => {

  useEffect(() => {
    document.body.classList.add("body-lock");
    return () => {
      document.body.classList.remove("body-lock");
    };
  }, []);

  return (
    <div className={`${styles.bg} ${fadeOut ? styles.fadeOut : ""}`}>
      <video
        playsInline
        preload="metadata"
        loop
        autoPlay
        muted
        className={styles.video}
      >
        <source src="/loading.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
