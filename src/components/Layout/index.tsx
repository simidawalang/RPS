import React, { ReactNode, useContext } from 'react';
import { RpsContext } from '../../context';
import { Button } from '../';

const Layout = ({ children }: { children: ReactNode }) => {
  const { connectWallet, currentAccount } = useContext(RpsContext);

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-300">
        <h3 className="font-bold text-2xl">RPS Game</h3>
        {!currentAccount ? (
          <Button onClick={connectWallet}>Connect</Button>
        ) : (
          <span>Current Account: {currentAccount}</span>
        )}
      </nav>

      <div className="px-8 py-4">{children}</div>
    </>
  );
};

export default Layout;
