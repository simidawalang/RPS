import { useState, useContext } from 'react';
import { RpsContext } from '../../context';
import Button from '../Button';
import SecureLS from 'secure-ls';
import { useCountdownTimer } from '../../utils/hook';

const CountdownTimer = ({
  timeoutInterval,
}: {
  timeoutInterval: number;
  startCountDown?: boolean;
}) => {
  const ls = new SecureLS();
  const {
    contractData,
    setContractData,
    currentAccount,
    j1_Timeout,
    j2_Timeout,
    gameEnded,
    setGameEnded,
  } = useContext(RpsContext);
  const timeoutTime = new Date(contractData?.last_action + timeoutInterval * 1000);
  const currentTime = new Date();

  const timeDifference = (Number(timeoutTime) - Number(currentTime)) / 1000;

  const [loading, setLoading] = useState(false);

  const timeoutPlayer1 = async () => {
    setLoading(true);
    await j1_Timeout();
    setLoading(false);
    setGameEnded(true);
  };

  const timeoutPlayer2 = async () => {
    setLoading(true);
    await j2_Timeout();
    setLoading(false);
  };

  const startNewGame = () => {
    setContractData({});
    ls.clear();
  };

  const { seconds, formattedMinutes, formattedSeconds } = useCountdownTimer(timeDifference);

  return (
    <div className="mt-8">
      <h1 className="font-bold text-3xl">Countdown Timer</h1>
      <p>
        Time Remaining: {formattedMinutes} minutes {formattedSeconds} seconds
      </p>

      {/* Timeout if player 1 did not make a valid move */}
      {seconds <= 0 &&
        ls.get('hash-data').move === '0' &&
        currentAccount?.toLowerCase() === contractData?.player_2?.toLowerCase() &&
        (!gameEnded ? (
          <Button className="mt-3" onClick={timeoutPlayer1}>
            {loading ? 'Loading...' : 'Player 1 Timeout'}
          </Button>
        ) : (
          <Button onClick={startNewGame}>Start New Game</Button>
        ))}

      {/* Timeout if player 2 did not play */}
      {seconds <= 0 &&
        !contractData?.c2 &&
        currentAccount?.toLowerCase() === contractData?.player_1?.toLowerCase() &&
        (!gameEnded ? (
          <Button className="mt-3" onClick={timeoutPlayer2}>
            {loading ? 'Loading...' : 'Player 2 Timeout'}
          </Button>
        ) : (
          <Button onClick={startNewGame}>Start New Game</Button>
        ))}
    </div>
  );
};

export default CountdownTimer;
