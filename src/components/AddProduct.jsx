import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { baseSepolia } from "@reown/appkit/networks";
import { useAppKitNetwork } from "@reown/appkit/react";
import useContractInstance from '../Hooks/useContractInstance';
import useSignerOrProvider from '../Hooks/useSignerorProvider';


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

const AddProduct = () => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [error, setError] = useState('');
  const { chainId } = useAppKitNetwork();

  const { signer } = useSignerOrProvider();
  const contract = useContractInstance(true);


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowForm(false);
    setShowUpload(true);
    resetForm();
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setShowUpload(true);
  };

  const changeHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        setError('File size exceeds 1MB. Please choose a smaller file.');
        setSelectedFile(null);
      } else {
        setError('');
        setSelectedFile(file);
      }
    }
  };
  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "Avatar",
      });
      formData.append("pinataMetadata", metadata);
      setShowForm(true)
      setShowUpload(false)

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const resData = await res.json();
      setImageUrl(`ipfs://${resData.IpfsHash}`);

      toast.success('Upload Successful',
        {
          position: 'top-center'
        });
    } catch (error) {
      console.error(error);
      toast.error('Upload Failed',
        { position: 'top-center' });
    }
  };

  const handleAddProduct = async () => {
    if (!signer || !contract) {
      toast.error('Wallet not connected', { position: 'top-center' });
      return;
    }

    if (Number(chainId) !== Number(baseSepolia.id)) {
      toast.error("You're not connected to baseSepolia Network", { position: "top-center" });
      return;
    }

    try {
      const _price = ethers.parseUnits(productPrice);
      const tx = await contract.listProduct(
        productName,
        imageUrl,
        productDesc,
        _price,
        productWeight
      );
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success('Product listed successfully!', {
          position: 'top-center',
        });
        resetForm();
        handleCloseModal();
      } else {
        toast.error('Listing failed', { position: 'top-center' });
      }
    } catch (error) {
      console.error(error);
      toast.error('Transaction failed!', { position: 'top-center' });
    }
  };

  const resetForm = () => {
    setProductName('');
    setImageUrl('');
    setProductDesc('');
    setProductWeight('');
    setProductPrice('');
  };

  return (
    <div>
      <button
        className="bg-white text-[#154A80] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-full lg:w-1/2 md:w-1/2 my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Add New Products
      </button>

      {showUpload && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <label className="form-label font-bold text-[20px] font-titiliumweb">Select a Product Image</label>
            <p>File must not be more than 1MB</p>
            <input type="file" onChange={changeHandler} className="my-4 w-full p-2 rounded-lg bg-transparent border border-white text-white backdrop-blur-lg outline-none" />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
              className="bg-white text-[#154A80] py-2 px-4 rounded-lg font-bold text-[16px] w-full my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
              onClick={handleSubmission}
            >
              Submit
            </button>
          </Box>
        </Modal>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="p-8 rounded-lg text-[#0F160F] flex flex-col items-center bg-[#2a2a2a] lg:w-1/3 md:w-1/3 w-11/12 mx-auto">
            <IoClose className="self-end mb-4 font-bold text-2xl text-white" onClick={handleClose} />
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="rounded-lg w-full text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <input
              type="text"
              placeholder="Image Url"
              value={imageUrl}
              readOnly
              className="rounded-lg w-full text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="rounded-lg w-full text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <input
              type="text"
              placeholder="Quantity"
              value={productWeight}
              onChange={(e) => setProductWeight(e.target.value)}
              className="rounded-lg w-full text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <input
              type="text"
              placeholder="Price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="rounded-lg w-full text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <button
              className="bg-[#263E59] text-white py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-full my-4"
              onClick={handleAddProduct}
            >
              List Product →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;


