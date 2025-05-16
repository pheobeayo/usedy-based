import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import useCreateProfile from '../Hooks/useCreateProfile';
import { toast } from "react-toastify";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  color: 'white',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  border: '1px solid #263E59',
  backgroundColor: '#263E59',
  p: 4,
};

const CreateProfile = ({ onProfileCreated }) => {
  const [open, setOpen] = useState(false);
  const [sellerName, setSellerName] = useState('');
  const [location, setLocation] = useState('');
  const [mail, setMail] = useState('');

  const { createProfile, isCreating } = useCreateProfile();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validateForm = useCallback(() => {
    if (!sellerName.trim()) {
      toast.error("Seller name is required", { position: "top-center" });
      return false;
    }
    
    if (!location.trim()) {
      toast.error("Location is required", { position: "top-center" });
      return false;
    }
    
    if (!mail.trim()) {
      toast.error("Email is required", { position: "top-center" });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return false;
    }
    
    return true;
  }, [sellerName, location, mail]);

  const handleCreateProfile = async () => {
    if (!validateForm()) return;
    
    const success = await createProfile(sellerName, location, mail);
    if (success) {
      setSellerName('');
      setLocation('');
      setMail('');
      setOpen(false);
      
      if (onProfileCreated && typeof onProfileCreated === 'function') {
        setTimeout(() => {
          onProfileCreated();
        }, 2000);
      }
      
      toast.success("Profile created successfully! The page will refresh shortly.", { 
        position: "top-center",
        autoClose: 2000
      });
    }
  };

  return (
    <div>
      <button
        className="bg-white text-[#154A80] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] lg:w-[50%] md:w-[50%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Create Profile
      </button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <input
            type="text"
            placeholder="Seller's Name"
            className="rounded-lg w-[100%] text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
          />
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
            className="bg-[#154A80] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
            onClick={handleCreateProfile}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create →"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateProfile;