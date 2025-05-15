import { useMemo } from "react";
import { ethers } from "ethers";
import useSignerorProvider from "./useSignerorProvider";
import usedyAbi from "../constants/usedyAbi.json";

const useContractInstance = (withSigner = false) => {
  const { signer, readOnlyProvider } = useSignerorProvider();

  return useMemo(() => {
    const providerOrSigner = withSigner ? signer : readOnlyProvider;
    if (!providerOrSigner) return null;

    return new ethers.Contract(
      import.meta.env.VITE_USEDY_ADDRESS,
      usedyAbi,
      providerOrSigner
    );
  }, [signer, readOnlyProvider, withSigner]);
};

export default useContractInstance;
