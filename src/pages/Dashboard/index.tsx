import { ethers } from 'ethers';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RpsContext } from '../../context';
import SecureLS from 'secure-ls';

const Dashboard = () => {
  const { hasher, currentAccount, deployRPS, contractAddress, getContractData } = useContext(RpsContext);
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
    if (name !== 'hash') {
      setMatchDetails((prev: any) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      setMatchDetails((prev: any) => {
        return {
          ...prev,
          [name]: ethers.utils,
        };
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const salt = Math.round(Math.random() * 100).toString();
    const hash = await hasher(move, salt);

    console.log('Hash:', hash);

    ls.set('player-1', {
      account: currentAccount,
      move,
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

  useEffect(() => {
    getContractData()
  }, [contractAddress])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select
          name="hash"
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
        <br />
        <input
          name="address"
          placeholder="Enter opponents address"
          value={matchDetails.address}
          onChange={handleOpponentChange}
        />
        <br />
        <input
          type="number"
          name="stake"
          placeholder="Amount of ETH to stake"
          value={matchDetails.stake}
          onChange={handleOpponentChange}
        />
        <button>Start game</button>
      </form>
      {loading && <div>loading</div>}
      {contractAddress && <div>Latest contract deployed to: {contractAddress}</div>} 
      {/* 0xD868b925f5f4983f09605Be561aD2cdeB21089Bc */}
    </div>
  );
};

export default Dashboard;
