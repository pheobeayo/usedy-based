import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useState, useCallback, useEffect } from "react";
import useContractInstance from "./useContractInstance";
import { ethers } from "ethers";

const useGetSeller = () => {
  const [allSeller, setAllSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerCount, setSellerCount] = useState(0);

  const contract = useContractInstance(false); // read-only
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

 
  const convertProxyToObject = (proxyData) => {
   
    if (proxyData && typeof proxyData === 'object' && 'length' in proxyData) {
      return Array.from({ length: proxyData.length }).map((_, i) => {
        if (proxyData[i] && typeof proxyData[i] === 'object' && 'length' in proxyData[i]) {
         
          return convertProxyToObject(proxyData[i]);
        }
        return proxyData[i];
      });
    }
    // If it's a simple value, return it as is
    return proxyData;
  };

  const fetchAllSeller = useCallback(async () => {
    if (!contract || !walletProvider) {
      console.log("Contract or wallet provider not available yet");
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching all sellers...");
      const rawData = await contract.getallSeller();
      console.log("Raw sellers data:", rawData);

      // Convert the proxy objects to plain JavaScript objects
      const sellersArray = convertProxyToObject(rawData);
      console.log("Converted sellers array:", sellersArray);

      if (!sellersArray || !Array.isArray(sellersArray) || sellersArray.length === 0) {
        console.warn("No valid seller data returned from contract");
        setAllSeller([]);
        setSellerCount(0);
        setLoading(false);
        return;
      }

      const mapped = sellersArray.map((item, index) => {
      
        if (!Array.isArray(item)) {
          console.warn(`Seller at index ${index} is not properly formatted:`, item);
          return null;
        }

        return {
          address: item[0] || "",
          id: (item[1] || "0").toString(),
          name: item[2] || "",
          location: item[3] || "",
          mail: item[4] || "",
          product: (item[5] || "0").toString(),
          weight: (item[6] || "0").toString(),
          payment: (item[7] || "0").toString(),
        };
      }).filter(item => item !== null); // Remove any null items

      console.log("Processed sellers data:", mapped);
      setAllSeller(mapped);
      setSellerCount(mapped.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError("Failed to load seller data");
      setAllSeller([]);
    } finally {
      setLoading(false);
    }
  }, [contract, walletProvider]);

  useEffect(() => {
    if (!isConnected) {
      setLoading(false); // Don't show loading if not connected
      return;
    }

    fetchAllSeller();

    // Only set up event listener if we have the necessary env variables
    const contractAddress = import.meta.env.VITE_USEDY_ADDRESS;
    const wsRpcUrl = import.meta.env.VITE_WSS_RPC_PROVIDER;
    
    if (!contractAddress || !wsRpcUrl) {
      console.error("Missing environment variables for WebSocket setup");
      return;
    }

    let provider;
    try {
      provider = new ethers.WebSocketProvider(wsRpcUrl);
      
     
      provider.getBlockNumber().catch(err => {
        console.error("WebSocket provider connection failed:", err);
      });

      const filter = {
        address: contractAddress,
        topics: [ethers.id("ProfileCreated(address,string,uint)")],
      };

      const onProfileCreated = (log) => {
        console.log("Profile created event detected:", log);
        fetchAllSeller();
      };

      provider.on(filter, onProfileCreated);

      return () => {
        if (provider) {
          provider.off(filter, onProfileCreated);
          provider.destroy(); 
        }
      };
    } catch (err) {
      console.error("Error setting up WebSocket provider:", err);
    }
  }, [isConnected, fetchAllSeller]);

  return {
    allSeller,
    loading,
    error,
    sellerCount,
    refetch: fetchAllSeller
  };
};

export default useGetSeller;