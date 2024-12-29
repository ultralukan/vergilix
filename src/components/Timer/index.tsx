// Timer.tsx
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

interface TimerProps {
  createdAt: string;
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ createdAt, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const targetTime = new Date(createdAt).getTime() + 30 * 60 * 1000;
    const timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(timerInterval);
        setTimeLeft(0);
        onComplete();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [createdAt, onComplete]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return <span>{!timeLeft ? <CircularProgress sx={{color: "#71E0C1", mt: '5px', ml: "5px"}} /> : formatTime(timeLeft)}</span>;
};

export default Timer;
