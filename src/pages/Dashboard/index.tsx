import { ethers } from 'ethers';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { RpsContext } from '../../context';
import SecureLS from 'secure-ls';
import CountdownTimer from '../../components/CountdownTimer';
import { Button, Input, Select } from '../../components';

const Dashboard = () => {
  const {
    hasher,
    currentAccount,
    deployRPS,
    contractAddress,
    getContractData,
    contractData,
    player2Move,
    solve,
  } = useContext(RpsContext);
  const ls = new SecureLS();

  const [matchDetails, setMatchDetails] = useState<any>({
    hash: '',
    address: '',
    stake: '0',
  });
  const [loading, setLoading] = useState(false);
  const [move, setMove] = useState('1');
  const [userMessage, setUserMessage] = useState('');
  const [startCountDown, setStartCountdown] = useState(false);

  const handleOpponentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setMatchDetails((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setUserMessage('');
    setLoading(true);
    setUserMessage('Generating hash...');
    const salt = Math.round(Math.random() * 100).toString();
    const hash = await hasher(move, salt);

    if (hash) {
      setUserMessage('Hash generated, deploying contract...');
    }

    ls.set('hash-data', {
      move,
      hash,
      salt,
    });

    const _contract = await deployRPS({
      hash,
      address: matchDetails.address,
      stake: matchDetails.stake,
    });

    await getContractData(_contract);
    await setLoading(false);
    setStartCountdown(true);
    setUserMessage('');
  };

  const player2_move = async (e: any) => {
    e.stopPropagation();

    setUserMessage('');
    setLoading(true);
    setUserMessage('Sending player 2 move...');

    await player2Move(move);
    await getContractData(contractAddress);
    setStartCountdown(false);
    await setLoading(false);
    setUserMessage('');
  };

  return (
    <div>
      <p className="font-bold mb-6">Interact with this app using Metamask on Sepolia Testnet</p>

      {/* Player 1 had deployed and added an opponent i.e. the contract exists*/}
      {contractData?.player_1 && (
        <div className="mb-8">
          <p>Player 1: {contractData?.player_1}</p>
          <p>Player 2: {contractData?.player_2}</p>

          <p>Amount to stake: {ethers.utils.formatEther(contractData?.stake._hex)}ETH</p>

          {contractAddress && <div>Contract deployed to: {contractAddress}</div>}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {!contractData?.player_1 && (
          <p className="font-bold mb-5">
            You&apos;re the first player, select your move and choose your opponent
          </p>
        )}

        <Select
          className="mb-3 md:max-w-[50%]"
          id="move"
          name="move"
          value={move}
          label="Move:"
          onChange={(e: any) => {
            setMove(e.target.value);
          }}
        >
          <option value={1}>ROCK</option>
          <option value={2}>PAPER</option>
          <option value={3}>SCISSORS</option>
          <option value={4}>SPOCK</option>
          <option value={5}>LIZARD</option>
        </Select>
        {!contractData?.player_1 ||
          (currentAccount !== contractData?.player_1 &&
            currentAccount !== contractData?.player_2 && (
              <div className="md:max-w-[50%]">
                <Input
                  className="mb-3"
                  label="Opponent Address:"
                  id="address"
                  name="address"
                  placeholder="Enter opponents address"
                  value={matchDetails.address}
                  onChange={handleOpponentChange}
                />

                <Input
                  className="mb-3"
                  label="Stake (ETH):"
                  id="stake"
                  type="number"
                  name="stake"
                  placeholder="Amount of ETH to stake"
                  value={matchDetails.stake}
                  onChange={handleOpponentChange}
                />

                <Button>{loading ? 'Loading...' : 'Start game'}</Button>
              </div>
            ))}
      </form>
      {loading && userMessage && <div>{userMessage}</div>}

      {/* Current account is Player 2 and has not played */}
      {currentAccount === contractData?.player_2 && !contractData?.c2 && (
        <div>
          <Button onClick={player2_move}>{loading ? 'Loading...' : 'Player 2 Move'}</Button>
        </div>
      )}

      {/* Player 1 has played and a timeout can be called from the contract */}
      {startCountDown && contractData.timeout && (
        <CountdownTimer
          initialSeconds={Number(contractData.timeout)}
          startCountDown={startCountDown}
        />
      )}

      {/* After player 2 has made a move, and the current address is the first player */}
      {contractData?.c2 && currentAccount === contractData?.player_1 && (
        <Button
          onClick={() => {
            solve({ move: ls.get('hash-data').move, salt: ls.get('hash-data').salt });
          }}
        >
          Solve
        </Button>
      )}
    </div>
  );
};

export default Dashboard;
