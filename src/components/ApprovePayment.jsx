import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { baseSepolia} from "@reown/appkit/networks";
import { TiWarning } from 'react-icons/ti';
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
  border: '1px solid #154A80',
  backgroundColor: '#154A80',
  p: 4,
};

const ApprovePayment = ({ id }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const contract  = useContractInstance(true);

  const handleApproval = async () => {
    if (!address) {
      return toast.error("Please connect your wallet", { position: "top-center" });
    }

    if (Number(chainId) !== Number(baseSepolia.id)) {
      return toast.error("You're not connected to baseSepolia Network", { position: "top-center" });
    }

    if (!contract) {
      return toast.error("Contract not available", { position: "top-center" });
    }

    try {
      const tx = await contract.approvePayment(id);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Payment approval successful!", { position: "top-center" });
      } else {
        toast.error("Payment approval failed", { position: "top-center" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment approval failed!", { position: "top-center" });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <button
        className="bg-white text-[#154A80] border border-[#154A80] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Approve Payment
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <input
            type="text"
            placeholder="Product ID"
            value={id}
            readOnly
            className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none hidden"
          />

          <div className="flex flex-col justify-center items-center">
            <TiWarning className="text-4xl" />
            <p className="my-4 text-center">
              Have you received your goods? If yes, approve. Else, cancel the transaction.
            </p>
          </div>

          <button
            className="bg-[#154A80] text-white py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
            onClick={handleApproval}
          >
            Approve &rarr;
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default ApprovePayment;
