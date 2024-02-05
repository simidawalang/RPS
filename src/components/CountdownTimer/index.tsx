import { useState, useEffect } from 'react';

const CountdownTimer = ({ initialSeconds }: { initialSeconds: number }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    while (seconds > 0) {
      const counterInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Cleanup the interval on component unmount or when seconds reach 0
      return () => clearInterval(counterInterval);
    }
  }, [seconds]);

  // Format seconds into minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div>
      <h1>Countdown Timer</h1>
      <p>
        Time Remaining: {minutes} minutes {remainingSeconds} seconds
      </p>
    </div>
  );
};

export default CountdownTimer;
