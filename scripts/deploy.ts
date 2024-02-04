// import { ethers } from "hardhat";
import { ethers } from "hardhat";

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = ethers.parseEther("0.001");

//   const lock = await ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

async function deploy ()  {
    const Hasher = await ethers.getContractFactory("Hasher");
    const hasherContract = await Hasher.deploy();
    await hasherContract.deployed();

    console.log("-- Goerli Network --")
    console.log(`Hasher contract deployed to ${hasherContract.address}`)
  
};

deploy().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

// To generate a hasher address, in the terminal, run:
// npx hardhat run scripts/deployHasher.ts --network goerli