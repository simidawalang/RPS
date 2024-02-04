import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as DotenvConfig } from "dotenv";

DotenvConfig();

const config: HardhatUserConfig = {
  solidity: "0.4.26",
  networks: {
    hardhat: {},
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
