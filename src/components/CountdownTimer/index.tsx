import { useState, useEffect, useContext } from 'react';
import { RpsContext } from '../../context';
import Button from '../Button';
import SecureLS from 'secure-ls';

const CountdownTimer = ({
  timeoutInterval,
  startCountDown,
}: {
  timeoutInterval: number;
  startCountDown?: boolean;
}) => {
  const ls = new SecureLS();
  const { contractData, setContractData, currentAccount, j2_Timeout } = useContext(RpsContext);
  const timeoutTime = new Date(contractData?.last_action + timeoutInterval * 1000);
  const currentTime = new Date();

  const timeDifference = (Number(timeoutTime) - Number(currentTime)) / 1000;

  const [seconds, setSeconds] = useState(timeDifference);
  const [loading, setLoading] = useState(false);

  const timeoutPlayer2 = async () => {
    setLoading(true);
    await j2_Timeout();
    setLoading(false);
    setContractData({});
    ls.remove('contract-address');
  };

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
  const minutes = seconds > 0 ? Math.floor(seconds / 60) : 0;
  const remainingSeconds = seconds > 0 ? Math.floor(seconds % 60) : 0;

  return (
    <div className="mt-8">
      <h1 className="font-bold text-3xl">Countdown Timer</h1>
      <p>
        Time Remaining: {minutes} minutes {remainingSeconds} seconds
      </p>

      {remainingSeconds <= 0 &&
        currentAccount?.toLowerCase() === contractData?.player_1?.toLowerCase() && (
          <div>
            <Button className="mt-3" onClick={timeoutPlayer2}>
              {loading ? 'Loading...' : 'Player 2 Timeout'}
            </Button>
          </div>
        )}
    </div>
  );
};

export default CountdownTimer;
