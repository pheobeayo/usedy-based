import { useEffect, useState, useCallback } from "react";
import { useAccount } from "reown/appkit-adapter-ethers";
import { useQuery } from "@tanstack/react-query";
import useContractInstance from "./useContractInstance";

const usePurchaseEvents = () => {
  const { address } = useAccount();
  const contract = useContractInstance(); 
  const [purchases, setPurchases] = useState([]);

  const purchaseHandler = useCallback((buyerAddress, id, quantity) => {
    if (buyerAddress.toLowerCase() !== address?.toLowerCase()) return;

    setPurchases((prev) => [
      ...prev,
      {
        buyerAddress,
        id: Number(id),
        quantity: Number(quantity),
      },
    ]);
  }, [address]);

  const fetchEvents = async () => {
    if (!contract || !address) return;

    const deploymentBlock = 2710870;

    const filter = contract.filters.ProductBought(address);
    const logs = await contract.queryFilter(filter, deploymentBlock, "latest");

    const parsedEvents = logs.map((e) => ({
      buyerAddress: e.args[0],
      id: Number(e.args[1]),
      quantity: Number(e.args[2]),
    }));

    setPurchases(parsedEvents);
    contract.on("ProductBought", purchaseHandler);

    return () => {
      contract.off("ProductBought", purchaseHandler);
    };
  };

  const { isLoading, error } = useQuery({
    queryKey: ["purchase-events", address],
    queryFn: fetchEvents,
    enabled: !!contract && !!address,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    return () => {
      if (contract) {
        contract.off("ProductBought", purchaseHandler);
      }
    };
  }, [contract, purchaseHandler]);

  return { purchases, isLoading, error };
};

export default usePurchaseEvents;
