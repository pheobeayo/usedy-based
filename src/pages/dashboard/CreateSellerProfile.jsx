import React, { useState, useEffect } from 'react';
import CreateProfile from '../../components/CreateProfile';
import profileBg from '../../assets/profile.png';
import useGetSeller from '../../Hooks/useGetSeller';
import { formatUnits } from 'ethers';
import EditProfile from '../../components/EditProfile';
import { useAppKitAccount } from '@reown/appkit/react';
import LoadingSpinner from '../../components/Loader/LoadingSpinner';

const CreateSellerProfile = () => {
  const { allSeller, loading, error, refetch } = useGetSeller();
  const { address } = useAppKitAccount();
  const [refreshing, setRefreshing] = useState(false);


  const handleProfileCreated = () => {
    console.log("Profile created, refreshing data...");
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  };

  
  const [userProfileExists, setUserProfileExists] = useState(false);
  
  useEffect(() => {
    if (address && Array.isArray(allSeller)) {
      const userProfile = allSeller.find(
        (seller) => seller?.address?.toLowerCase() === address?.toLowerCase()
      );
      setUserProfileExists(!!userProfile);
    }
  }, [address, allSeller]);

  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 8);
    return `${start}...`;
  };

  const convertToWholeNumber = (formattedNumber) => {
    try {
      const number = parseFloat(formattedNumber);
      return isNaN(number) ? 0 : Math.floor(number);
    } catch (err) {
      console.error("Error converting number:", err);
      return 0;
    }
  };

 
  const handleManualRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  };

  return (
    <main>
      <div className='flex flex-col lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white'>
        <div className='lg:w-[60%] md:w-[60%] w-[100%] p-8'>
            <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4'>
              Usedy - Where environmental consciousness gets you rewarded
            </h2>
            <p>To get started listing your eco friendly product, create a seller's profile.</p>
            
            <div className='mt-6'>
              {userProfileExists ? (
                <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 my-4">
                  <p className="font-medium">You already have a seller profile! 🎉</p>
                  <p className="text-sm mt-2">You can now add products and manage your listings.</p>
                </div>
              ) : (
                <CreateProfile onProfileCreated={handleProfileCreated} />
              )}
            </div>
        </div>
        <div className='lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center'>
            <img src={profileBg} alt="dashboard" className='w-[100%] lg:w-[60%] md:w-[60%]'/>
        </div>
      </div>

      <div className="flex justify-between items-center my-6">
        <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold'>All Seller's Profile</h2>
        <button 
          onClick={handleManualRefresh}
          disabled={loading || refreshing}
          className="flex items-center bg-[#154A80] text-white py-2 px-4 rounded-lg hover:bg-[#0d3a66] transition-colors"
        >
          {refreshing ? (
            <>
              <span className="mr-2">Refreshing</span>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            <>
              <span>Refresh</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading seller profiles...</span>
        </div>
      ) : error ? (
        <div className="text-center py-6 bg-red-100 border border-red-300 rounded-lg text-red-700 p-4">
          <p className="font-bold">Error loading profiles</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={handleManualRefresh}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : Array.isArray(allSeller) && allSeller.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-4 text-gray-700 font-medium">No seller profiles found</p>
          <p className="text-gray-500 mt-2">Be the first to create a seller profile!</p>
        </div>
      ) : (
        <div className='flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 text-[#0F160F] flex-wrap'>
          {Array.isArray(allSeller) && allSeller.map((info, index) => {
            // Skip invalid entries
            if (!info || !info.address) return null;
            
            const isCurrentUser = info.address?.toLowerCase() === address?.toLowerCase();
            
            return (
              <div 
                className={`lg:w-[32%] md:w-[32%] w-[100%] p-4 border ${isCurrentUser ? 'border-[#154A80] border-2' : 'border-[#0F160F]/20'} rounded-lg mb-4 shadow-lg transition-all hover:shadow-xl`} 
                key={`seller-${index}-${info.id || info.address}`}
              >
                {isCurrentUser && (
                  <div className="bg-[#154A80]/10 text-[#154A80] text-sm font-medium px-3 py-1 rounded-full inline-block mb-3">
                    Your Profile
                  </div>
                )}
                <img 
                  src='https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg' 
                  alt="" 
                  className='w-[120px] h-[120px] rounded-full mx-auto' 
                />
                <h3 className='font-bold lg:text-[20px] md:text-[20px] text-[18px] capitalize text-center mt-3'>
                  {info.name || "Unnamed Seller"}
                </h3>
                <p className='flex justify-between my-4'>Mail <span>{info.mail || "No email provided"}</span></p>
                <p className='flex justify-between my-4'>Location <span>{info.location || "No location provided"}</span></p>
                <p className='flex justify-between my-4'>Products <span>{info.product || "0"}</span></p>
                <p className='flex justify-between my-4'>Seller's wallet address: <span>{truncateAddress(info.address)}</span></p>
                <p className='flex justify-between my-4 font-bold'>
                  Payment Total: <span>{convertToWholeNumber(formatUnits(info.payment || "0"))} ETH</span>
                </p>
                {isCurrentUser && <EditProfile id={Number(info.id)} onProfileUpdated={refetch} />}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default CreateSellerProfile;