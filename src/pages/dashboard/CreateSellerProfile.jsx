import React, { useEffect, useState } from 'react'
import CreateProfile from '../../components/CreateProfile'
import profileBg from '../../assets/profile.png'
import useGetSeller from '../../Hooks/useGetSeller'
import { formatUnits } from 'ethers';
import EditProfile from '../../components/EditProfile';
import { useAppKitAccount } from '@reown/appkit/react';


const CreateSellerProfile = () => {
  const sellerData = useGetSeller();
  const [allSeller, setAllSeller] = useState([]);
  const { address } = useAppKitAccount(); 
  useEffect(() => {
    
    if (sellerData) {
    
      if (Array.isArray(sellerData)) {
        setAllSeller(sellerData);
      } 
      
      else if (sellerData.data && Array.isArray(sellerData.data)) {
        setAllSeller(sellerData.data);
      }
     
      else if (sellerData.sellers && Array.isArray(sellerData.sellers)) {
        setAllSeller(sellerData.sellers);
      } 
      else if (sellerData.items && Array.isArray(sellerData.items)) {
        setAllSeller(sellerData.items);
      }
      
      else {
        console.error('Unable to extract seller data array:', sellerData);
        setAllSeller([]);
      }
    }
  }, [sellerData]);
  
  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 8);
    return `${start}...`;
  };
  
  const convertToWholeNumber = (formattedNumber) => {
    const number = parseFloat(formattedNumber);
    return Math.floor(number);
  };
  
  return (
   <main>
     <div className='flex flex-col lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white'>
        <div className='lg:w-[60%] md:w-[60%] w-[100%] p-8'>
           <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4'>Usedy - Where environmental consciousness gets you rewarded</h2>
            <p>To get started listing your eco friendly product, create a seller's profile.</p>
            <div className='mt-6'>
            <CreateProfile />
            </div>
        </div>
        <div className='lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center'>
            <img src={profileBg} alt="dashboard" className='w-[100%] lg:w-[60%] md:w-[60%]'/>
        </div>
    </div>
    <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold my-6'>All Seller's Profile</h2>
    <div className='flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 text-[#0F160F] flex-wrap'>
      {Array.isArray(allSeller) && allSeller.length > 0 ? allSeller.map((info) => (
        <div className='lg:w-[32%] md:w-[32%] w-[100%] p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg' key={info.id}>
          <img src='https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg?t=st=1719630441~exp=1719634041~hmac=3d0adf83dadebd27f07e32abf8e0a5ed6929d940ed55342903cfc95e172f29b5&w=2000' alt="" className='w-[120px] h-[120px] rounded-full mx-auto'/>
          <h3 className='font-bold lg:text-[20px] md:text-[20px] text-[18px] capitalise text-center'>{info.name}</h3>
          <p className='flex justify-between my-4'>Mail <span>{info.mail}</span></p>
          <p className='flex justify-between my-4'>Location <span>{info.location}</span></p>
          <p className='flex justify-between my-4'>Products <span>{info.product}</span></p>
          <p className='flex justify-between my-4'>Seller's wallet address: <span>{truncateAddress(info.address)}</span></p>
          <p className='flex justify-between my-4 font-bold'>Payment Total: <span>{convertToWholeNumber(formatUnits(info.payment))}AMB</span> </p>
         {info.address === address && ( <EditProfile id={Number(info.id)} />)}
        </div>
      )) : (
        <div className="w-full text-center py-8">
          <p>No seller profiles found. Be the first to create one!</p>
        </div>
      )}
    </div>
   </main>
  )
}

export default CreateSellerProfile