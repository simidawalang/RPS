import { useState, useEffect, useContext } from 'react';
import { RpsContext } from '../../context';
import Button from '../Button';
import {formatTime} from '../../utils/helpers';

const CountdownTimer = ({
  initialSeconds,
  startCountDown,
}: {
  initialSeconds: number;
  startCountDown: boolean;
}) => {
  const { contractData } = useContext(RpsContext);

  const player1Time = new Date(contractData?.last_action);
  const timeoutTime = new Date(contractData?.last_action + initialSeconds * 1000);
  const currentTime = new Date();

  const timeDifference = (Number(timeoutTime) - Number(currentTime)) / 1000;

  const [seconds, setSeconds] = useState(timeDifference);

  console.log(Number(timeoutTime) - Number(player1Time))

  useEffect(() => {
    if (seconds > 0) {
      const counterInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(counterInterval);
    } else {
      return;
    }
  }, [seconds, startCountDown]);

  // Format seconds into minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return (
    <div className="mt-8">
      <h1 className="font-bold text-3xl">Countdown Timer</h1>
      <p>
        Time Remaining: {minutes} minutes {remainingSeconds} seconds
      </p>

      {seconds === 0 && <Button>Player 2 Timeout</Button>}
    </div>
  );
};

export default CountdownTimer;
