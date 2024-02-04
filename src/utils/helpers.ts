import { ethers } from "ethers";
import { RPS_ABI, RPS_BYTECODE } from "../constants";
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const deploy = async (data: any) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/eth_goerli"
      );
      const signer = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
  
      const RPS_Factory = new ethers.ContractFactory(RPS_ABI, RPS_BYTECODE, signer);
  
      const deployedContract = await RPS_Factory.deploy(data.hash, data.address, {
        value: ethers.utils.formatEther(data.stake)
      });
      await deployedContract.deployTransaction.wait();
  
      return deployedContract;
    } catch (e) {
      console.log(e);
    }
  };
