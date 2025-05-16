import { useState, useCallback, useEffect } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { ethers } from "ethers";
import useContractInstance from "./useContractInstance"; 

const useGetAllProduct = () => {
    const [allProduct, setAllProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider("eip155");
    const contract = useContractInstance(true); 

    const convertIpfsUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("ipfs://")) {
            return url.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        return url;
    };

    // Helper function to convert ethers.js Proxy objects to plain JS objects
    const convertProxyToObject = (proxyData) => {
        // If it's an array-like object, convert it to a real array and process each item
        if (proxyData && typeof proxyData === 'object' && 'length' in proxyData) {
            return Array.from({ length: proxyData.length }).map((_, i) => {
                if (proxyData[i] && typeof proxyData[i] === 'object' && 'length' in proxyData[i]) {
                   
                    return convertProxyToObject(proxyData[i]);
                }
                return proxyData[i];
            });
        }
        return proxyData;
    };

    const fetchAllProduct = useCallback(async () => {
        if (!isConnected) {
            setLoading(false);
            return;
        }
        
        if (!walletProvider || !contract) {
            console.log("Dependencies not ready:", { hasProvider: !!walletProvider, hasContract: !!contract });
            return;
        }

        setLoading(true);
        try {
            console.log("Fetching all products...");
            const rawData = await contract.getAllproduct();
            console.log("Raw product data:", rawData);

            const productsArray = convertProxyToObject(rawData);
            console.log("Converted product array:", productsArray);

            if (!productsArray || !Array.isArray(productsArray) || productsArray.length === 0) {
                console.warn("No valid product data returned from contract");
                setAllProduct([]);
                setLoading(false);
                return;
            }
            
            const converted = productsArray.map((item, index) => {
                
                if (!Array.isArray(item)) {
                    console.warn(`Product at index ${index} is not properly formatted:`, item);
                    return null;
                }

                return {
                    id: (index + 1).toString(),
                    address: item[0] || "",
                    name: item[1] || "",
                    image: convertIpfsUrl(item[2] || ""),
                    location: item[3] || "",
                    product: item[4] || "",
                    price: item[5] || ethers.parseEther("0"), // Default to 0 ETH if missing
                    weight: (item[6] || "0").toString(),
                    sold: item[7] || false,
                    inProgress: item[8] || false
                };
            }).filter(item => item !== null); // Remove any null items

            console.log("Processed products:", converted);
            setAllProduct(converted);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products");
            setAllProduct([]);
        } finally {
            setLoading(false);
        }
    }, [isConnected, walletProvider, contract]);

    useEffect(() => {
        fetchAllProduct();

        if (!isConnected) return;
        
        const contractAddress = import.meta.env.VITE_USEDY_ADDRESS;
        const wsRpcUrl = import.meta.env.VITE_WSS_RPC_PROVIDER;
        
        if (!contractAddress || !wsRpcUrl) {
            console.error("Missing environment variables for WebSocket setup");
            return;
        }

        let provider;
        try {
            provider = new ethers.WebSocketProvider(wsRpcUrl);
            
            // Test the connection
            provider.getBlockNumber().catch(err => {
                console.error("WebSocket provider connection failed:", err);
            });

            const filter = {
                address: contractAddress,
                topics: [ethers.id("ProductListed(address,string,uint)")],
            };

            const onProductListed = (log) => {
                console.log("Product listed event detected:", log);
                fetchAllProduct();
            };

            provider.on(filter, onProductListed);

            return () => {
                if (provider) {
                    provider.off(filter, onProductListed);
                    provider.destroy(); // Close the WebSocket connection
                }
            };
        } catch (err) {
            console.error("Error setting up WebSocket provider:", err);
        }
    }, [isConnected, fetchAllProduct]);

    return {
        allProduct,
        loading,
        error,
        refetch: fetchAllProduct
    };
};

export default useGetAllProduct;