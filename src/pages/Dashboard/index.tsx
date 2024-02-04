import {ethers} from "ethers";
import React, { ChangeEvent, FormEvent, useState } from "react";

const Dashboard = () => {
  const [matchDetails, setMatchDetails] = useState<any>({
    hash: "",
    address: "",
    stake: 0,
  });

  const [move, setMove] = useState("");

  const handleOpponentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "hash") {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

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
        hash: {matchDetails.hash}
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
    </div>
  );
};

export default Dashboard;
