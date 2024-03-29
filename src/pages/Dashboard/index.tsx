import { ethers } from 'ethers';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { RpsContext } from '../../context';
import SecureLS from 'secure-ls';
import CountdownTimer from '../../components/CountdownTimer';
import { Button, Input, Select } from '../../components';
import useAsyncEffect from 'use-async-effect';
import { generateRandomInteger } from '../../utils/helpers';

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
    setContractData,
    gameEnded,
    setGameEnded,
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
    const salt = generateRandomInteger();
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
      address: matchDetails.address.trim(),
      stake: matchDetails.stake,
    });

    await getContractData(_contract);
    await setLoading(false);
    setUserMessage('');
    setMove('1');
  };

  const player2_move = async (e: any) => {
    e.stopPropagation();

    setUserMessage('');
    setLoading(true);
    setUserMessage('Sending player 2 move...');

    await player2Move(move);
    await getContractData(contractAddress);
    await setLoading(false);
    setMove('1');
    setUserMessage('');
  };

  const solveGame = async () => {
    setLoading(true);
    await solve({ move: ls.get('hash-data').move, salt: ls.get('hash-data').salt });
    setUserMessage('Check your balance to see if you won, lost or had a tie');
    setLoading(false);
    setGameEnded(true);
  };

  useAsyncEffect(() => {
    getContractData(contractAddress);
  }, [contractAddress]);

  console.log(contractAddress)
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {currentAccount ? (
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
              className="mb-3 "
              id="move"
              name="move"
              value={move}
              label="Move:"
              onChange={(e: any) => {
                setMove(e.target.value);
              }}
            >
              {/* First option corresponds to NULL value. Also, from the contract, player 2 is not alllowed to make a NULL move */}
              {!contractAddress && <option value={0}>Select a move</option>}
              <option value={1}>ROCK</option>
              <option value={2}>PAPER</option>
              <option value={3}>SCISSORS</option>
              <option value={4}>SPOCK</option>
              <option value={5}>LIZARD</option>
            </Select>
            {!contractData?.player_1 && (
              <div className="">
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

                <Button
                  disabled={
                    matchDetails.address.length === 0 ||
                    matchDetails.address?.toLowerCase().trim() ===
                      currentAccount?.toLowerCase().trim()
                  }
                >
                  {loading ? 'Loading...' : 'Start Game'}
                </Button>
              </div>
            )}
          </form>

          {/* Current account is Player 2 and has not played */}
          {currentAccount?.toLowerCase() === contractData?.player_2?.toLowerCase() &&
            !contractData?.c2 && (
              <Button onClick={player2_move}>{loading ? 'Loading...' : 'Player 2 Move'}</Button>
            )}

          {/* Player 1 made a valid move, player 2 made a valid move. From the contract, only player 1 can call this */}
          {ls.get('hash-data').move !== '0' &&
            contractData?.c2 &&
            currentAccount?.toLowerCase() === contractData?.player_1?.toLowerCase() && (
              <div>
                {!gameEnded ? (
                  <Button onClick={solveGame}>{loading ? 'Loading...' : 'Solve'}</Button>
                ) : (
                  <Button
                    className="block mt-2"
                    onClick={() => {
                      ls.remove('contract-address');
                      setUserMessage('');
                      setContractData({});
                    }}
                  >
                    Start New Game
                  </Button>
                )}
              </div>
            )}
          {userMessage && <div className="mt-4">{userMessage}</div>}
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}

      {/* Show the countdown timer after player 1 has played */}
      {contractData.c1Hash && <CountdownTimer timeoutInterval={Number(contractData.timeout)} />}
    </div>
  );
};

export default Dashboard;
