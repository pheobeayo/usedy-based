import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppKitProvider } from "@reown/appkit/react";
import useContractInstance from "../Hooks/useContractInstance"; // make sure it's default export

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

const EditProfile = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [mail, setMail] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { walletProvider } = useAppKitProvider("eip155");
  const contract  = useContractInstance(true);

  const handleEditProfile = async () => {
    if (!walletProvider || !contract) {
      toast.error("Wallet provider or contract not available", {
        position: "top-center",
      });
      return;
    }

    try {
      const tx = await contract.updateProfile(location, mail);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Profile edit successful!", { position: "top-center" });
      } else {
        toast.error("Profile edit failed", { position: "top-center" });
      }
    } catch (error) {
      console.error("Edit profile error:", error);
      toast.error("Transaction failed", { position: "top-center" });
    } finally {
      setLocation('');
      setMail('');
      setOpen(false);
    }
  };

  return (
    <div>
      <button
        className="bg-[#263E59] text-white py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:font-bold"
        onClick={handleOpen}
      >
        Edit Profile
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input
            type="text"
            placeholder="Location"
            className="rounded-lg w-[100%] border text-white border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="email"
            placeholder="Mail"
            className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <button
            className="bg-[#263E59] text-white py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
            onClick={handleEditProfile}
          >
            Edit &rarr;
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default EditProfile;
