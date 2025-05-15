import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import abi from "../constants/usedyAbi.json";
import { baseSepolia} from "@reown/appkit/networks";
import useContractInstance from "./useContractInstance";

const useCreateProfile = () => {
  const [isCreating, setIsCreating] = useState(false);
  const contract = useContractInstance(true); 
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);

  const createProfile = useCallback(
    async (sellerName, location, mail) => {
      if (!sellerName || !location || !mail) {
        toast.error("All fields are required", { position: "top-center" });
        return false;
      }

      if (!address) {
        toast.error("Please connect your wallet", { position: "top-center" });
        return false;
      }

      if (Number(chainId) !== Number(baseSepolia.id)) {
        toast.error("You're not connected to baseSepolia Network" , { position: "top-center" });
        return false;
      }

      if (!contract) {
        toast.error("Contract not ready", { position: "top-center" });
        return false;
      }

      setIsCreating(true);

      try {
        const tx = await contract.createProfile(sellerName, location, mail);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Profile creation successful!", { position: "top-center" });
          return true;
        } else {
          toast.error("Profile creation failed", { position: "top-center" });
          return false;
        }
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Failed to create profile - ${decodedError.reason}`, {
          position: "top-center",
        });
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [contract, address, chainId]
  );

  return { createProfile, isCreating };
};

export default useCreateProfile;
