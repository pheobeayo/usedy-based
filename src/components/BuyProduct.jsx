import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { baseSepolia} from "@reown/appkit/networks";
import { ethers } from 'ethers';
import useContractInstance from '../Hooks/useContractInstance';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  color: 'white',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  border: '1px solid #1E1D34',
  backgroundColor: '#1E1D34',
  p: 4,
};

const BuyProduct = ({ id, price }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0); 
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!isProcessing) {
      setOpen(false);
    }
  };

  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const contract = useContractInstance(true);

  const handleBuyProduct = async () => {
    if (!address) {
      return toast.error("Please connect your wallet", { position: "top-center" });
    }

    if (Number(chainId) !== Number(baseSepolia.id)) {
      return toast.error("You're not connected to baseSepolia Network" , { position: "top-center" });
    }

    if (!contract) {
      return toast.error("Contract is not ready", { position: "top-center" });
    }

    if (!amount || amount <= 0) {
      return toast.error("Please enter a valid amount", { position: "top-center" });
    }

    setIsProcessing(true);

    try {
      
      const priceInWei = ethers.parseUnits(price.toString(), 18);
      
    
      const amountValue = parseInt(amount);
      
     
      const total = priceInWei * BigInt(amountValue);
      
      console.log("Price (ETH):", price);
      console.log("Price (Wei):", priceInWei.toString());
      console.log("Amount:", amountValue);
      console.log("Total (Wei):", total.toString());
      
      toast.info("Processing transaction...", { position: "top-center" });
      
      const tx = await contract.buyProduct(id, amountValue, { value: total });
      
      toast.info("Transaction submitted, waiting for confirmation...", { position: "top-center" });
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Product purchase successful!", { position: "top-center" });
        setOpen(false);
      } else {
        toast.error("Product purchase failed", { position: "top-center" });
      }
    } catch (error) {
      console.error("Transaction error:", error);
      
   
      if (error.message && error.message.includes("insufficient funds")) {
        toast.error("Insufficient funds in your wallet", { position: "top-center" });
      } else if (error.message && error.message.includes("user rejected")) {
        toast.error("Transaction rejected", { position: "top-center" });
      } else {
        toast.error(`Transaction failed: ${error.message || "Unknown error"}`, { position: "top-center" });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  
  const estimatedTotal = amount && price ? (Number(amount) * Number(price)).toFixed(6) : "0";

  return (
    <div>
      <button
        className="bg-white text-[#263E59] border border-[#263E59] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Buy Product
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Purchase Product</h2>
            <p className="text-sm text-white/70">Price per unit: {price} ETH</p>
          </div>
          
          <input
            type="text"
            placeholder="Product ID"
            value={id}
            readOnly
            className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none hidden"
          />
          
          <label className="block mb-1 text-sm">Quantity</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-2 outline-none"
          />
          
          <div className="my-3 p-3 bg-white/10 rounded-lg">
            <div className="flex justify-between">
              <span>Price per unit:</span>
              <span>{price} ETH</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{amount || 0}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-white/20 mt-2 pt-2">
              <span>Total:</span>
              <span>{estimatedTotal} ETH</span>
            </div>
          </div>
          
          <button
            className="bg-[#263E59] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2"
            onClick={handleBuyProduct}
            disabled={isProcessing || !amount || amount <= 0}
          >
            {isProcessing ? "Processing..." : `Buy Product (${estimatedTotal} ETH)`}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default BuyProduct;