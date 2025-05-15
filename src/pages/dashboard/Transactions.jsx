import React, { useState, useEffect } from "react";
import bgIcon from "../../assets/transaction.png";
import emptyPurchase from "../../assets/order.png";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "ethers";
import UseGetAllProduct from "../../Hooks/UseGetAllProduct";
import useGetSeller from "../../Hooks/useGetSeller";
import useSignerorProvider from "../../Hooks/useSignerorProvider";
import useContractInstance from "../../Hooks/useContractInstance";

const Transactions = () => {
  const navigate = useNavigate();
  const {  address } = useSignerorProvider();
  const { usedyContract } = useContractInstance(false); // using readOnlyProvider for reading
  const allProduct = UseGetAllProduct();
  const allSeller = useGetSeller();

  const [value, setValue] = useState("1");
  const [purchase, setPurchase] = useState([]);
  const [approved, setApproved] = useState([]);

  const userSeller = allSeller.find((data) => data?.address === address);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!usedyContract || !address) return;

      try {
        const deploymentBlockNumber = 2710870; // Update if needed

        const purchaseFilter = usedyContract.filters.ProductBought(address);
        const approveFilter = usedyContract.filters.PaymentApproved(address);

        const [purchaseEvents, approveEvents] = await Promise.all([
          usedyContract.queryFilter(purchaseFilter, deploymentBlockNumber, "latest"),
          usedyContract.queryFilter(approveFilter, deploymentBlockNumber, "latest"),
        ]);

        const purchases = purchaseEvents.map((event) => ({
          address: event.args[0],
          id: Number(event.args[1]),
          quantity: Number(event.args[2]),
        }));

        const approvedItems = approveEvents.map((event) => ({
          address: event.args[0],
          id: Number(event.args[1]),
          amount: Number(event.args[2]),
        }));

        setPurchase(purchases);
        setApproved(approvedItems);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchEvents();
  }, [usedyContract, address]);

  return (
    <main>
      <section className="flex flex-col lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white">
        <div className="lg:w-[60%] md:w-[60%] w-[100%] p-8">
          <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4">
            Usedy - Where environmental consciousness gets you rewarded
          </h2>
          <p>
            View all your eco-friendly product purchases in one place. Track your contributions to a greener planet with each sustainable product you buy.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard/marketplace")}
              className="bg-white text-[#154A80] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] lg:w-[50%] md:w-[50%] w-[100%] my-2 hover:bg-[#C7D5D8] hover:font-bold"
            >
              Buy Product
            </button>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center">
          <img src={bgIcon} alt="dashboard" className="w-[70%] mx-auto" />
        </div>
      </section>

      <section>
        <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] md:text-[24px] font-[700] mt-4">
          Purchased Products
        </h2>
        <div className="flex mb-6 text-[#0F160F] items-center">
          <img
            src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg"
            alt=""
            className="w-[40px] h-[40px] rounded-full"
          />
          {userSeller ? (
            <p className="ml-4 font-bold">{userSeller.name}</p>
          ) : (
            <p>Unregistered.</p>
          )}
        </div>
      </section>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab label="Purchased Items" value="1" />
              <Tab label="Approved Items" value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <section className="text-[#0F160F] flex lg:flex-row md:flex-row flex-col justify-between">
              {purchase.length === 0 ? (
                <div className="flex flex-col items-center w-full">
                  <img src={emptyPurchase} alt="" />
                  <p>No purchase yet</p>
                </div>
              ) : (
                purchase.map((p, index) => {
                  const product = allProduct.find((item) => item?.id === p.id);

                  return (
                    <div
                      key={index}
                      className="border p-4 mb-4 rounded-lg shadow-md lg:w-[32%] md:w-[32%] w-[100%]"
                    >
                      <p className="my-4">
                        <strong>Quantity:</strong> {p.quantity}
                      </p>
                      {product ? (
                        <>
                          <img src={product.image} alt="" className="w-[300px] h-[300px] mb-4" />
                          <p>
                            <strong>Product Name:</strong> {product.name}
                          </p>
                          <p className="flex justify-between my-4 font-bold">
                            Price <span>{formatUnits(product.price)} AMB</span>
                          </p>
                        </>
                      ) : (
                        <p>Product details not available.</p>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          </TabPanel>

          <TabPanel value="2">
            <section className="text-[#0F160F] flex lg:flex-row md:flex-row flex-col justify-between">
              {approved.length === 0 ? (
                <div className="flex flex-col items-center w-full">
                  <img src={emptyPurchase} alt="" />
                  <p>No Approved Payment yet</p>
                </div>
              ) : (
                approved.map((p, index) => {
                  const product = allProduct.find((item) => item?.id === p.id);

                  return (
                    <div
                      key={index}
                      className="border p-4 mb-4 rounded-lg shadow-md lg:w-[32%] md:w-[32%] w-[100%]"
                    >
                      {product ? (
                        <>
                          <img src={product.image} alt="" className="w-[300px] h-[300px] mb-4" />
                          <p className="flex justify-between my-4 font-bold">
                            Price <span>{formatUnits(product.price)} AMB</span>
                          </p>
                        </>
                      ) : (
                        <p>Product details not available.</p>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          </TabPanel>
        </TabContext>
      </Box>
    </main>
  );
};

export default Transactions;
