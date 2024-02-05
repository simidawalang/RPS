import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { RPS_ABI, RPS_BYTECODE } from '../constants';

export const connectToContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract('', RPS_ABI, signer);

    return contract;
  } catch (e) {
    console.log(e);
  }
};

export const formatTime = (time: any) => {
  const _time = new Date(parseInt(time, 10));

  const formattedTime =
    `${Number(_time.getHours()) < 10 ? '0' : ''}` +
    _time.getHours() +
    `:${Number(_time.getMinutes()) < 10 ? '0' : ''}` +
    _time.getMinutes();

  return formattedTime;
};
