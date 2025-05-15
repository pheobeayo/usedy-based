import { useAppKitProvider } from "@reown/appkit/react";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { readOnlyProvider }from "../constants/readOnlyProvider"

const useSignerOrProvider = () => {
  const [signer, setSigner] = useState();

  const { walletProvider } = useAppKitProvider("eip155");

  const provider = useMemo(
    () => (walletProvider ? new ethers.BrowserProvider(walletProvider) : null),
    [walletProvider]
  );
  console.log(provider)

  useEffect(() => {
    if (!provider) return setSigner(null);

    provider.getSigner().then((newSigner) => {
      if (!signer) return setSigner(newSigner);
      if (newSigner.address === signer.address) return;
      setSigner(newSigner);
    });
  }, [provider, signer]);

  return { signer, provider, readOnlyProvider };
};

export default useSignerOrProvider;