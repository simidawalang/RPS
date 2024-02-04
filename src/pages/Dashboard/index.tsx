import { ethers } from 'ethers';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RpsContext } from '../../context';
import SecureLS from 'secure-ls';
import useAsyncEffect from 'use-async-effect';

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

    setLoading(true);
    const salt = Math.round(Math.random() * 100).toString();
    const hash = await hasher(move, salt);

    console.log('Hash:', hash);

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
  };

  // useEffect(() => {
  //   getContractData()
  // }, [contractAddress])

  const getData = async () => {
    setLoading(true);

    await getContractData();
    setLoading(false);
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

  console.log(contractData);

  return (
    <div>
      {contractData?.player_1 && (
        <div>
          <p>P1: {contractData?.player_1}</p>
          <p>P2: {contractData?.player_2}</p>

          <p>Amount to stake: {ethers.utils.formatEther(contractData?.stake._hex)}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <p>You&apos;re the first player, select your move and choose your opponent</p>
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
      {loading && <div>loading</div>}
      {contractAddress && <div>Latest contract deployed to: {contractAddress}</div>}
      {/* 0xD868b925f5f4983f09605Be561aD2cdeB21089Bc */}
      {/* <button onClick={getData}>get contract data</button> */}

      {currentAccount === contractData?.player_2 && (
        <div>
          <button onClick={player2_move}>Player 2</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
