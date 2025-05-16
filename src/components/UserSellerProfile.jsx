import { useAppKitAccount } from "@reown/appkit/react";
import { useMemo, useState, useEffect } from "react";
import useGetSeller from "../Hooks/useGetSeller";
import useGetAllProduct from "../Hooks/UseGetAllProduct";  // Make sure this matches your actual file path and casing
import LoadingSpinner from "./Loader/LoadingSpinner";
import { formatUnits } from "ethers";
import emptyCart from "../assets/cart.png";
import { Link } from "react-router-dom";

const UserSellerProfile = () => {
  const { address } = useAppKitAccount();
  const [mounted, setMounted] = useState(false);

  // Get seller and product data from hooks
  const { allSeller, loading: sellerLoading} = useGetSeller();
  const { allProduct, loading: productLoading } = useGetAllProduct();

  // Ensure component is mounted before doing calculations
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Find the current user's seller profile
  const userSeller = useMemo(() => {
    if (!mounted || !allSeller || !address) return null;
    return allSeller.find((data) => data?.address?.toLowerCase() === address?.toLowerCase());
  }, [allSeller, address, mounted]);

  // Filter products to only show this user's products
  const userProducts = useMemo(() => {
    if (!mounted || !allProduct || !address) return [];
    return Array.isArray(allProduct) 
      ? allProduct.filter((info) => info?.address?.toLowerCase() === address?.toLowerCase())
      : [];
  }, [allProduct, address, mounted]);

  // Debug logging
  useEffect(() => {
    if (mounted) {
      console.log("Current user address:", address);
      console.log("All sellers:", allSeller);
      console.log("User seller found:", userSeller);
      console.log("All products:", allProduct);
      console.log("User products filtered:", userProducts);
    }
  }, [mounted, address, allSeller, userSeller, allProduct, userProducts]);

  const isLoading = sellerLoading || productLoading;

 
  const safeFormatUnits = (value) => {
    try {
      if (!value) return "0";
      return formatUnits(value);
    } catch (error) {
      console.error("Error formatting units:", error, "Value was:", value);
      return "0";
    }
  };

  return (
    <div>
      <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] md:text-[24px] font-[700] mt-2">
        Listed Products
      </h2>

      <div className="flex mb-6 text-[#0F160F] items-center">
        <img
          src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg"
          alt=""
          className="w-[40px] h-[40px] rounded-full"
        />
        {sellerLoading ? (
          <p className="ml-4">Loading seller info...</p>
        ) : userSeller ? (
          <p className="ml-4 font-bold">{userSeller.name}</p>
        ) : (
          <p className="ml-4 text-gray-600">You haven't registered as a seller yet.</p>
        )}
      </div>

    <div className="flex flex-col lg:flex-row justify-between flex-wrap md:flex-row">
        {isLoading ? (
          <div className="w-full flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : userProducts.length === 0 ? (
          <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
            <img src={emptyCart} alt="empty" className="w-[300px] h-[300px]" />
            <h2 className="text-[18px] lg:text-[24px] md:text-[24px] mb-4 text-center">
              No Products yet!
            </h2>
          </div>
        ) : (
          userProducts.map((info, index) => (
            <div
              key={index}
              className="w-[100%] lg:w-[31%] md:w-[31%] rounded-lg border border-bg-ash/35 bg-gray p-4 mt-6"
            >
              <Link
                to={`/dashboard/market_place/${info.id}`}
                className="text-[#0F160F]"
              >
                <img
                  src={info.image || "https://via.placeholder.com/400"}
                  alt={info.name}
                  className="w-full h-[237px] object-cover object-center rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400";
                  }}
                />
                <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalize">
                  {info.name || "Unnamed Product"}
                </h3>
                <p className="flex justify-between my-4">
                  Quantity <span>{Number(info.weight) || 0}</span>
                </p>
                <p className="flex justify-between my-4">
                  Seller's location <span>{info.location || "Unknown"}</span>
                </p>
                <p className="flex justify-between my-4 font-bold">
                  Price <span>{safeFormatUnits(info.price)} ETH</span>
                </p>
                <button className="my-4 border w-full py-2 px-4 border-[#154A80] text-[#154A80] rounded-lg">
                  View details
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSellerProfile;