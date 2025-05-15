import { useAppKitAccount } from "@reown/appkit/react";
import { useMemo } from "react";
import useGetSeller from "../Hooks/useGetSeller";
import UseGetAllProduct from "../Hooks/UseGetAllProduct";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { formatUnits } from "ethers";
import emptyCart from "../assets/cart.png";
import { Link } from "react-router-dom";

const UserSellerProfile = () => {
  const { address } = useAppKitAccount();

  const { allSeller, loading: sellerLoading, error: sellerError } = useGetSeller();
  const allProduct = UseGetAllProduct(); // You can update this to return loading and error if needed

  const userSeller = useMemo(() => {
    return allSeller.find((data) => data?.address === address);
  }, [allSeller, address]);

  const userProducts = useMemo(() => {
    return allProduct.filter((info) => info?.address === address);
  }, [allProduct, address]);

  const isLoading = sellerLoading || !allProduct;

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
        ) : sellerError ? (
          <p className="ml-4 text-red-500">Error loading seller profile.</p>
        ) : userSeller ? (
          <p className="ml-4 font-bold">{userSeller.name}</p>
        ) : (
          <p className="ml-4 text-gray-600">You haven't registered as a seller yet.</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between flex-wrap md:flex-row">
        {isLoading ? (
          <LoadingSpinner />
        ) : userProducts.length === 0 ? (
          <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
            <img src={emptyCart} alt="empty" className="w-[300px] h-[300px]" />
            <h2 className="text-[18px] lg:text-[24px] md:text-[24px] mb-4 text-center">
              No Product yet!
            </h2>
          </div>
        ) : (
          userProducts.map((info, index) => (
            <div
              key={index}
              className="w-[100%] lg:w-[31%] md:w-[31%] rounded-lg border border-bg-ash/35 bg-bg-gray p-4 mt-6"
            >
              <Link
                to={`/dashboard/market_place/${info.id}`}
                className="text-[#0F160F]"
              >
                <img
                  src={info.image}
                  alt={info.name}
                  className="w-full h-[237px] object-cover object-center rounded-lg"
                />
                <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalize">
                  {info.name}
                </h3>
                <p className="flex justify-between my-4">
                  Quantity <span>{Number(info.weight)}</span>
                </p>
                <p className="flex justify-between my-4">
                  Seller's location <span>{info.location}</span>
                </p>
                <p className="flex justify-between my-4 font-bold">
                  Price <span>{formatUnits(info.price)} ETH</span>
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
