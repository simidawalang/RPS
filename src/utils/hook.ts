import { useEffect, useState } from 'react';

export const useCountdownTimer = (delay: number) => {
  const [seconds, setSeconds] = useState(delay);
  // delay must be in seconds

  const formattedMinutes = seconds > 0 ? Math.floor(seconds / 60) : 0;
  const formattedSeconds = seconds > 0 ? Math.floor(seconds % 60) : 0;

  useEffect(() => {
    if (seconds > 0) {
      const counterInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(counterInterval);
    } else {
      return;
    }
  }, [seconds]);

  return { formattedMinutes, formattedSeconds, seconds };
};
