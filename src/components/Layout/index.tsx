import React, { ReactNode, useContext } from "react";
import { RpsContext } from "../../context";

const Layout = ({ children }: { children: ReactNode }) => {
  const { connectWallet, currentAccount } = useContext(RpsContext);

  return (
    <div>
      <nav>
        {!currentAccount && <button onClick={connectWallet}>Connect</button>}
        {currentAccount}
      </nav>
      {children}
    </div>
  );
};

export default Layout;
