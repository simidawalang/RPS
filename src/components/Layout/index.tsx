import React, { ReactNode, useContext } from 'react';
import { RpsContext } from '../../context';
import styles from './styles.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  const { connectWallet, currentAccount } = useContext(RpsContext);

  return (
    <>
      <nav className={styles.nav}>
        <h3>RPS Game</h3>
        {!currentAccount ? (
          <button onClick={connectWallet}>Connect</button>
        ) : (
          <span>Current Account: {currentAccount}</span>
        )}
      </nav>

      <div className={styles.layout}>{children}</div>
    </>
  );
};

export default Layout;
