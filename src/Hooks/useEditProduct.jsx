import { useState } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import useContractInstance from './useContractInstance';
import { useAppKitProvider } from '@reown/appkit/react';

const useEditProduct = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { walletProvider } = useAppKitProvider("eip155");
  const contract  = useContractInstance(true);

  const editProduct = async ({ id, name, imageUrl, description, price, weight }) => {
    if (!walletProvider || !contract) {
      return toast.error("Wallet or contract not available", { position: "top-center" });
    }

    setIsEditing(true);

    try {
      const priceInWei = ethers.parseUnits(price || "0", "ether");
      const tx = await contract.updateProduct(id, name, imageUrl, description, priceInWei, weight);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Product updated successfully!", { position: "top-center" });
        return true;
      } else {
        toast.error("Product update failed!", { position: "top-center" });
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed!", { position: "top-center" });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  return { editProduct, isEditing };
};

export default useEditProduct;
