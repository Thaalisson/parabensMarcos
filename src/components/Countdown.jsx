import { useEffect, useState } from "react";

const targetDate = new Date('2025-04-29T00:00:00').getTime();

export default function Countdown({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        onFinish();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinish]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <h1 className="text-white text-7xl font-bold animate-pulse text-center">
      {formatTime(timeLeft)}
    </h1>
  );
}
