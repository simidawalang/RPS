import React, { useState, createContext, ReactNode } from 'react';
import { Contract, ethers } from 'ethers';
import useAsyncEffect from 'use-async-effect';
import SecureLS from 'secure-ls';
import { RPS_ABI, RPS_BYTECODE, HASHER_ADDRESS, HASHER_ABI } from '../constants';

interface IProvider {
  children: ReactNode;
}

const ls = new SecureLS();

export const RpsContext = createContext<any>(undefined);

export const RpsProvider = ({ children }: IProvider) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [contractAddress, setContractAddress] = useState(ls.get('contract-address') || '');
  const [contractData, setContractData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

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
    console.log('deploying rps');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const RPS_Factory = new ethers.ContractFactory(RPS_ABI, RPS_BYTECODE, signer);
      const deployedContract = await RPS_Factory.deploy(data.hash, data.address, {
        value: ethers.utils.parseEther(data.stake),
      });
      await deployedContract.deployed();

      setContractAddress(deployedContract.address);
      ls.set('contract-address', deployedContract.address);
      setContractAddress(deployedContract.address);
      return deployedContract.address;
    } catch (e) {
      console.log(e);
    }
  };

  const getContractData = async (address: string) => {
    try {
      if (address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let rpsContract = new Contract(address, RPS_ABI, provider);

        const player_1 = await rpsContract.j1();
        const player_2 = await rpsContract.j2();
        const TIMEOUT = await rpsContract.TIMEOUT();
        const c1Hash = await rpsContract.c1Hash();
        const c2 = await rpsContract.c2();
        const stake = await rpsContract.stake();
        const lastAction = await rpsContract.lastAction();

        setContractData({
          player_1,
          player_2,
          c1Hash,
          timeout: ethers.BigNumber.from(TIMEOUT._hex).toNumber(),
          c2,
          stake,
          last_action: lastAction._hex * 1000,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const j1_Timeout = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const rpsContract = new Contract(contractAddress, RPS_ABI, signer);
      const res = await rpsContract.j1Timeout();
      await res.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const j2_Timeout = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const rpsContract = new Contract(contractAddress, RPS_ABI, signer);
      const res = await rpsContract.j2Timeout();
      await res.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const player2Move = async (move: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const amount = ethers.utils.formatUnits(contractData.stake._hex, 18);

      const rpsContract = new ethers.Contract(contractAddress, RPS_ABI, signer);
      const res = await rpsContract.play(move, {
        value: ethers.utils.parseEther(amount),
      });

      await res.wait();

      return res;
    } catch (e) {
      console.log(e);
    }
  };

  const solve = async (data: any) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const rpsContract = new ethers.Contract(contractAddress, RPS_ABI, signer);
      const res = await rpsContract.solve(data.move, data.salt);

      await res.wait();

      return res;
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
        gameEnded,
        setGameEnded,
        setContractData,
        hasher,
        deployRPS,
        contractAddress,
        contractData,
        getContractData,
        player2Move,
        j1_Timeout,
        j2_Timeout,
        solve,
      }}
    >
      {children}
    </RpsContext.Provider>
  );
};
