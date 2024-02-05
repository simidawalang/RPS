import { useState, useEffect } from 'react';

const CountdownTimer = ({
  initialSeconds,
  startCountDown,
}: {
  initialSeconds: number;
  startCountDown: boolean;
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0 && startCountDown) {
      const counterInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Cleanup the interval on component unmount or when seconds reach 0
      return () => clearInterval(counterInterval);
    } else {
      return;
    }
  }, [seconds, startCountDown]);

  // Format seconds into minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="mt-8">
      <h1 className="font-bold text-3xl">Countdown Timer</h1>
      <p>
        Time Remaining: {minutes} minutes {remainingSeconds} seconds
      </p>
    </div>
  );
};

export default CountdownTimer;
