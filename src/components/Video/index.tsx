import { useEffect, useState } from "react";
import styles from "./index.module.scss";

export const VideoComponent = ({ fadeOut }: { fadeOut: boolean }) => {
  const [currentText, setCurrentText] = useState("V_");
  const [capitalizeIndices, setCapitalizeIndices] = useState<number[]>([]);
  const [isTextComplete, setIsTextComplete] = useState(false);

  useEffect(() => {
    document.body.classList.add("body-lock");
    return () => {
      document.body.classList.remove("body-lock");
    };
  }, []);

  useEffect(() => {
    const targetText = "Vergilix_";
    let index = 1;

    const intervalId = setInterval(() => {
      if (index < targetText.length - 1) {
        setCurrentText(`V${targetText.slice(1, index + 1)}_`);
        index++;
      } else {
        clearInterval(intervalId);
        setIsTextComplete(true);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isTextComplete) return;

    const capitalizeIntervalId = setInterval(() => {
      const textLength = currentText.length - 1;
      const indices = [];

      while (indices.length < 2) {
        const randomIndex = Math.floor(Math.random() * textLength);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }

      setCapitalizeIndices(indices);
    }, 300);

    return () => clearInterval(capitalizeIntervalId);
  }, [isTextComplete, currentText]);

  const getCapitalizedText = (text, indices) => {
    return text
      .split("")
      .map((char, i) => (indices.includes(i) ? char.toUpperCase() : char.toLowerCase()))
      .join("");
  };

  return (
    <div className={`${styles.bg} ${fadeOut ? styles.fadeOut : ""}`}>
      <div className={styles.text}>
        {isTextComplete
          ? getCapitalizedText(currentText, capitalizeIndices)
          : currentText}
      </div>
    </div>
  );
};