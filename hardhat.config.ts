import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.4.26',
  defaultNetwork: 'goerli',
  networks: {
    hardhat: {},
    goerli: {
      url: 'https://rpc.ankr.com/eth_goerli',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
