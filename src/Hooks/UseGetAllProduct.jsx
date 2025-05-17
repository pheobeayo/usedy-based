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

    // Improved function to properly convert ethers Result objects to real arrays
    const convertToRealArray = (result) => {
        if (!result) return [];
        
        // If it's already a standard array, return it
        if (Array.isArray(result)) return result;
        
        // Convert array-like object to a real array
        if (typeof result === 'object' && 'length' in result && typeof result.length === 'number') {
            // Use Array.from with a proper mapping function
            return Array.from({ length: Number(result.length) }, (_, i) => {
                const item = result[i];
                // Recursively convert nested array-like objects
                if (item && typeof item === 'object' && 'length' in item) {
                    return convertToRealArray(item);
                }
                return item;
            });
        }
        
        // If it's not array-like at all, return an empty array
        return [];
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

            // Convert the raw data to a real JavaScript array
            const productsArray = convertToRealArray(rawData);
            console.log("Converted to real array:", productsArray);

            if (!productsArray.length) {
                console.warn("No products found or empty array returned");
                setAllProduct([]);
                setLoading(false);
                return;
            }
            
            // Process each product item
            const converted = productsArray.map((item, index) => {
                // Make sure each product item is also a real array
                const productArray = convertToRealArray(item);
                
                if (!productArray.length) {
                    console.warn(`Product at index ${index} couldn't be converted to array:`, item);
                    return null;
                }

                // Map the array items to an object with named properties
                return {
                    id: (index + 1).toString(),
                    address: productArray[0] || "",
                    name: productArray[1] || "",
                    image: convertIpfsUrl(productArray[2] || ""),
                    location: productArray[3] || "",
                    product: productArray[4] || "",
                    price: productArray[5] || ethers.parseEther("0"), // Default to 0 ETH if missing
                    weight: (productArray[6] || "0").toString(),
                    sold: productArray[7] || false,
                    inProgress: productArray[8] || false
                };
            }).filter(Boolean); // Remove any null or undefined items

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