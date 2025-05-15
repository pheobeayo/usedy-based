import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import useEditProduct from "../Hooks/useEditProduct";

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

const EditProduct = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [error, setError] = useState('');

  const { editProduct, isEditing } = useEditProduct();

  const resetState = () => {
    setOpen(false);
    setShowForm(false);
    setSelectedFile(null);
    setImageUrl('');
    setProductName('');
    setProductWeight('');
    setProductDesc('');
    setProductPrice('');
    setError('');
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
    if (!selectedFile) return toast.error("No file selected", { position: "top-center" });

    setImageUrl(`ipfs://fakehash/${selectedFile.name}`); 
    setShowForm(true);
  };

  const handleEditProduct = async () => {
    const success = await editProduct({
      id,
      name: productName,
      imageUrl,
      description: productDesc,
      price: productPrice,
      weight: productWeight,
    });

    if (success) resetState();
  };

  return (
    <div>
      <button
        className="bg-[#263E59] py-2 text-white mb-4 px-4 rounded-lg text-[16px] font-bold w-full hover:bg-bg-ash"
        onClick={() => setOpen(true)}
      >
        Edit Information
      </button>

      {!showForm && (
        <Modal open={open} onClose={resetState}>
          <Box sx={style}>
            <label className="font-bold text-[20px]">Select a Product Image</label>
            <p>File must not be more than 1MB</p>
            <input type="file" onChange={changeHandler} className="my-4 w-full p-2 rounded-lg bg-transparent border border-white text-white backdrop-blur-lg outline-none" />
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="bg-white text-[#154A80] py-2 px-4 rounded-lg font-bold w-full my-2"
              onClick={handleSubmission}
            >
              Submit
            </button>
          </Box>
        </Modal>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#263E59] bg-opacity-75">
          <div className="p-8 rounded-lg text-white bg-[#263E59] w-full max-w-md">
            <IoClose className="ml-auto text-2xl cursor-pointer" onClick={resetState} />
            <input type="text" value={id} readOnly className="form-input" />
            <input type="text" placeholder="Product Name" onChange={(e) => setProductName(e.target.value)} className="form-input" />
            <input type="text" value={imageUrl} readOnly className="form-input" />
            <input type="text" placeholder="Description" onChange={(e) => setProductDesc(e.target.value)} className="form-input" />
            <input type="text" placeholder="Quantity" onChange={(e) => setProductWeight(e.target.value)} className="form-input" />
            <input type="text" placeholder="Price (ETH)" onChange={(e) => setProductPrice(e.target.value)} className="form-input" />
            <button
              className="bg-[#263E59] text-white py-2 px-4 rounded-lg font-bold w-full mt-4"
              onClick={handleEditProduct}
              disabled={isEditing}
            >
              {isEditing ? "Editing..." : "Edit Product →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
