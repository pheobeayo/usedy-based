import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useContractInstance from "./useContractInstance";

const useGetPurchase = () => {
  const [purchase, setPurchase] = useState(null);
  const contract = useContractInstance(false); // Read-only
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  useEffect(() => {
    if (!isConnected || !walletProvider || !contract) return;

    const wsProvider = new ethers.WebSocketProvider(
      import.meta.env.VITE_WSS_RPC_PROVIDER
    );

    const filter = {
      address: import.meta.env.VITE_USEDY_ADDRESS,
      topics: [ethers.id("ProductBought(address,uint256,uint256)")],
    };

    const handleEvent = (buyer, id, quantity) => {
      console.log("ProductBought:", buyer, id, quantity);
      setPurchase({ buyer, id: id.toString(), quantity: quantity.toString() });
    };

    wsProvider.on(filter, (log) => {
      const parsed = contract.interface.parseLog(log);
      const { args } = parsed;
      handleEvent(args[0], args[1], args[2]);
    });

    return () => {
      wsProvider.off(filter);
    };
  }, [isConnected, walletProvider, contract]);

  return purchase;
};

export default useGetPurchase;
