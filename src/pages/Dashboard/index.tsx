import { ethers } from 'ethers';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RpsContext } from '../../context';
import SecureLS from 'secure-ls';
import useAsyncEffect from 'use-async-effect';
import CountdownTimer from '../../components/CountdownTimer';

const Dashboard = () => {
  const {
    hasher,
    currentAccount,
    deployRPS,
    contractAddress,
    getContractData,
    contractData,
    player2Move,
  } = useContext(RpsContext);
  const ls = new SecureLS();

  const [matchDetails, setMatchDetails] = useState<any>({
    hash: '',
    address: '',
    stake: '0',
  });
  const [loading, setLoading] = useState(false);
  const [move, setMove] = useState('0');
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

    console.log('Hash:', hash);
    if (hash) {
      setUserMessage('Hash generated, deploying contract...');
    }

    ls.set('hash-data', {
      hash,
      salt,
    });

    await deployRPS({
      hash,
      address: matchDetails.address,
      stake: matchDetails.stake,
    });

    setLoading(false);
    setStartCountdown(true);
  };

  const getData = async () => {
    setLoading(true);

    await getContractData();
    setLoading(false);
    setMove('0');
  };

  const player2_move = async () => {
    setLoading(true);
    await player2Move(move);
    setLoading(false);
  };

  useEffect(() => {
    ls.clear();
  }, []);

  useAsyncEffect(() => {
    getData();
  }, [contractAddress]);

  //console.log(typeof contractData.timeout);

  return (
    <div>
      {contractData?.player_1 && (
        <div >
          <p >P1: {contractData?.player_1}</p>
          <p>P2: {contractData?.player_2}</p>

          <p>Amount to stake: {ethers.utils.formatEther(contractData?.stake._hex)}</p>

          {contractAddress && <div>Contract deployed to: {contractAddress}</div>}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {!contractData.player_1 && (
          <p className='font-bold'>You&apos;re the first player, select your move and choose your opponent</p>
        )}
        <label htmlFor="move">Move:</label>
        <br />
        <select
          id="move"
          name="move"
          value={move}
          onChange={(e: any) => {
            console.log(e.target.name);
            setMove(e.target.value);
          }}
        >
          <option value={1}>ROCK</option>
          <option value={2}>PAPER</option>
          <option value={3}>SCISSORS</option>
          <option value={4}>SPOCK</option>
          <option value={5}>LIZARD</option>
        </select>
        <br /> <br /> <br />
        {!contractData.player_1 && (
          <div>
            <label htmlFor="address">Opponent Address: </label>
            <br />
            <input
              id="address"
              name="address"
              placeholder="Enter opponents address"
              value={matchDetails.address}
              onChange={handleOpponentChange}
            />
            <br /> <br /> <br />
            <label htmlFor="stake">Stake: </label>
            <br />
            <input
              id="stake"
              type="number"
              name="stake"
              placeholder="Amount of ETH to stake"
              value={matchDetails.stake}
              onChange={handleOpponentChange}
            />
            <br />
            <br />
            <button>Start game</button>
          </div>
        )}
      </form>
      {loading && userMessage && <div>{userMessage}</div>}
      {currentAccount === contractData?.player_2 && (
        <div>
          <button onClick={player2_move}>Player 2</button>
        </div>
      )}{' '}
      {startCountDown && contractData.timeout && (
        <CountdownTimer initialSeconds={Number(contractData.timeout)} />
      )}
    </div>
  );
};

export default Dashboard;
