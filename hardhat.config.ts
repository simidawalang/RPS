import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.4.26',
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    goerli: {
      url: 'https://rpc.ankr.com/eth_goerli',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    sepolia: {
      chainId: 11155111,
      url: 'https://sepolia.infura.io/v3/8f4df0c6ecf848449d52aef1907be787',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
