import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useState, useCallback, useEffect } from "react";
import useContractInstance from "./useContractInstance";
import { ethers } from "ethers";

const useGetSeller = () => {
  const [allSeller, setAllSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerCount, setSellerCount] = useState(0);

  const contract = useContractInstance(false); 
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  
  const convertToRealArray = (result) => {
    if (!result) return [];
    
    if (Array.isArray(result)) return result;
  
    if (typeof result === 'object' && 'length' in result && typeof result.length === 'number') {

      return Array.from({ length: Number(result.length) }, (_, i) => {
        const item = result[i];
      
        if (item && typeof item === 'object' && 'length' in item) {
          return convertToRealArray(item);
        }
        return item;
      });
    }
    

    return [];
  };

  const fetchAllSeller = useCallback(async () => {
    if (!contract) {
      console.log("Contract instance not available yet");
      setError("Contract instance not available");
      setLoading(false);
      return;
    }

    if (!walletProvider) {
      console.log("Wallet provider not available yet");
      setError("Wallet provider not available");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to fetch sellers with contract:", contract);

      if (typeof contract.getallSeller !== 'function') {
        console.error("Contract does not have getallSeller method:", contract);
        setError("Contract interface mismatch - missing getallSeller method");
        setLoading(false);
        return;
      }
      
      const rawData = await contract.getallSeller();
      console.log("Raw sellers data received:", rawData);
      const sellersArray = convertToRealArray(rawData);
      console.log("Converted to real array:", sellersArray);

      if (!sellersArray.length) {
        console.warn("No sellers found or empty array returned");
        setAllSeller([]);
        setSellerCount(0);
        setLoading(false);
        return;
      }

      const mapped = sellersArray.map((item, index) => {
        const sellerArray = convertToRealArray(item);
        
        if (!sellerArray.length) {
          console.warn(`Seller at index ${index} couldn't be converted to array:`, item);
          return null;
        }

        try {
          return {
            address: sellerArray[0] || "",
            id: (sellerArray[1] ? sellerArray[1].toString() : "0"),
            name: sellerArray[2] || "",
            location: sellerArray[3] || "",
            mail: sellerArray[4] || "",
            product: (sellerArray[5] ? sellerArray[5].toString() : "0"),
            weight: (sellerArray[6] ? sellerArray[6].toString() : "0"),
            payment: (sellerArray[7] ? sellerArray[7].toString() : "0"),
          };
        } catch (err) {
          console.error(`Error processing seller at index ${index}:`, err, item);
          return null;
        }
      }).filter(Boolean); 

      console.log("Processed sellers data:", mapped);
      setAllSeller(mapped);
      setSellerCount(mapped.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError(`Failed to load seller data: ${err.message}`);
      setAllSeller([]);
    } finally {
      setLoading(false);
    }
  }, [contract, walletProvider]);

  useEffect(() => {
    if (!isConnected) {
      console.log("User not connected - skipping seller fetch");
      setLoading(false); 
      return;
    }

    console.log("User connected - fetching seller data");
    fetchAllSeller();

    const contractAddress = import.meta.env.VITE_USEDY_ADDRESS;
    const wsRpcUrl = import.meta.env.VITE_WSS_RPC_PROVIDER;
    
    if (!contractAddress || !wsRpcUrl) {
      console.error("Missing environment variables for WebSocket setup:", {
        contractAddress: !!contractAddress,
        wsRpcUrl: !!wsRpcUrl
      });
      return;
    }

    console.log("Setting up WebSocket listener for contract events");
    let provider;
    try {
      provider = new ethers.WebSocketProvider(wsRpcUrl);
      
      provider.getBlockNumber()
        .then(blockNumber => {
          console.log("WebSocket provider connected - current block:", blockNumber);
        })
        .catch(err => {
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
      console.log("Event listener set up for ProfileCreated events");

      return () => {
        console.log("Cleaning up WebSocket provider");
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