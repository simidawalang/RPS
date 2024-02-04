import React, { useState, createContext, ReactNode } from 'react';
import { Contract, ethers } from 'ethers';
import useAsyncEffect from 'use-async-effect';
import { RPS_ABI, RPS_BYTECODE, HASHER_ADDRESS, HASHER_ABI } from '../constants';

interface IProvider {
  children: ReactNode;
  test?: string;
}

export const RpsContext = createContext<any>(undefined);

export const RpsProvider = ({ children }: IProvider) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [contractAddress, setContractAddress] = useState(
    localStorage.getItem('contract-address') || ''
  );
  const [contractData, setContractData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert('Kindly install Metamask');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const checkIfConnected = async () => {
    try {
      if (!window.ethereum) return alert('Kindly install Metamask');

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const checkIfAccountsChanged = async () => {
    checkIfConnected();
    try {
      window.ethereum.on('accountsChanged', async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts) {
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setCurrentAccount('');
          setIsConnected(false);
        }
      });
    } catch (e) {}
  };

  const hasher = async (move: string, salt: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      const hasherContract = new ethers.Contract(HASHER_ADDRESS, HASHER_ABI, signer);

      const hashResult = await hasherContract.hash(move, salt);
      return hashResult;
    } catch (e) {
      console.log(e);
    }
  };

  const deployRPS = async (data: any) => {
    try {
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = new ethers.Wallet(
        '479a4b2282bb0124affadc56d6d34fef340e8bd2c87a055bcbb60a0dfe401388',
        provider
      );

      const RPS_Factory = new ethers.ContractFactory(RPS_ABI, RPS_BYTECODE, signer);
      const deployedContract = await RPS_Factory.deploy(data.hash, data.address, {
        value: ethers.utils.parseEther(data.stake),
      });
      await deployedContract.deployed();

      console.log(deployedContract);
      setContractAddress(deployedContract.address);

      return deployedContract;
    } catch (e) {
      console.log(e);
    }
  };

  const getContractData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const rpsContract = new Contract(
        '0xD868b925f5f4983f09605Be561aD2cdeB21089Bc',
        RPS_ABI,
        provider
      );

      const player_1 = await rpsContract.j1();
      const player_2 = await rpsContract.j1();
      const TIMEOUT = await rpsContract.TIMEOUT();
      const c1Hash = await rpsContract.c1Hash();
      const c2 = await rpsContract.c2();
      const stake = await rpsContract.stake();
      const lastAction = await rpsContract.lastAction();

      setContractData({ player_1, player_2, c1Hash, TIMEOUT, c2, stake, lastAction });
      console.log(player_1);
      
    } catch (e) {
      console.log(e);
    }
  };

  const timeout = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const rpsContract = new Contract(
        '0xD868b925f5f4983f09605Be561aD2cdeB21089Bc',
        RPS_ABI,
        provider
      );

      const player_1 = await rpsContract.j1();
      const player_2 = await rpsContract.j1();
      const TIMEOUT = await rpsContract.TIMEOUT();
      const c1Hash = await rpsContract.c1Hash();
      const c2 = await rpsContract.c2();
      const stake = await rpsContract.stake();
      const lastAction = await rpsContract.lastAction();

      setContractData({ player_1, player_2, c1Hash, TIMEOUT, c2 });
      console.log(player_1);
    } catch (e) {
      console.log(e);
    }
  };

  useAsyncEffect(() => {
    checkIfAccountsChanged();

    return () => checkIfAccountsChanged();
  }, []);

  return (
    <RpsContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
        connectWallet,
        isConnected,
        hasher,
        deployRPS,
        contractAddress,
        contractData,
        getContractData,
      }}
    >
      {children}
    </RpsContext.Provider>
  );
};
