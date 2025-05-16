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
      
      // Verify the contract has the expected method
      if (typeof contract.getallSeller !== 'function') {
        console.error("Contract does not have getallSeller method:", contract);
        setError("Contract interface mismatch - missing getallSeller method");
        setLoading(false);
        return;
      }
      
      const rawData = await contract.getallSeller();
      console.log("Raw sellers data received:", rawData);

      // Convert the proxy objects to plain JavaScript objects
      const sellersArray = convertProxyToObject(rawData);
      console.log("Converted sellers array:", sellersArray);

      if (!sellersArray || !Array.isArray(sellersArray)) {
        console.warn("No valid seller data returned from contract");
        setAllSeller([]);
        setSellerCount(0);
        setLoading(false);
        return;
      }

      const mapped = sellersArray
        .map((item, index) => {
          if (!Array.isArray(item)) {
            console.warn(`Seller at index ${index} is not properly formatted:`, item);
            return null;
          }

          // Add more robust checking for each field
          try {
            return {
              address: item[0] || "",
              id: (item[1] ? item[1].toString() : "0"),
              name: item[2] || "",
              location: item[3] || "",
              mail: item[4] || "",
              product: (item[5] ? item[5].toString() : "0"),
              weight: (item[6] ? item[6].toString() : "0"),
              payment: (item[7] ? item[7].toString() : "0"),
            };
          } catch (err) {
            console.error(`Error processing seller at index ${index}:`, err, item);
            return null;
          }
        })
        .filter(item => item !== null); // Remove any null items

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
      setLoading(false); // Don't show loading if not connected
      return;
    }

    console.log("User connected - fetching seller data");
    fetchAllSeller();

    // Only set up event listener if we have the necessary env variables
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
      
      // Check if provider is properly connected
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