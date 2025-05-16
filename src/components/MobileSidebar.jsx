import { useState,useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { CgHomeAlt } from "react-icons/cg";
import { BiBox } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbSettings } from "react-icons/tb";
import { ImCart } from "react-icons/im";
import { BsBell } from "react-icons/bs";
import { BsReceipt } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useDisconnect,  useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import logo from '../assets/logo.svg'
import { ethers } from "ethers";

const MobileSidebar = () => {
  const [isOpen, setOpen] = useState(false);
   const { disconnect } = useDisconnect();
  const { address } = useAppKitAccount();
   const { walletProvider } = useAppKitProvider("eip155");
   const [shortAddress, setShortAddress] = useState("");
   const [balance, setBalance] = useState("0");
   
   useEffect(() => {
     if (address) {
       const formatted = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
       setShortAddress(formatted);
       
       const fetchBalance = async () => {
         try {
           if (walletProvider) {
             const provider = new ethers.BrowserProvider(walletProvider);
             const balanceWei = await provider.getBalance(address);
             const balanceEth = ethers.formatEther(balanceWei);
             setBalance(parseFloat(balanceEth).toFixed(4));
           }
         } catch (error) {
           console.error("Error fetching balance:", error);
           setBalance("Error");
         }
       };
       
       fetchBalance();
     }
   }, [address, walletProvider]);

  const activeStyle = {
    borderLeft: '1px solid #2A382A',
    borderRight: '1px solid #2A382A',
    width: '100%',
    padding: '20px'
  };

  return (
    <header className="lg:hidden md:hidden flex justify-between my-4 relative">
      <img src={logo} alt="" className="w-[150px] my-4" />
      <Hamburger toggled={isOpen} toggle={setOpen} color="#427142" direction="right" />
      {isOpen && (
        <div className="bg-[#EDF5FE] text-[rgb(15,22,15)] p-8 py-12 h-[100vh] w-[50%] absolute top-20 left-0 bg-baseBlack/70 z-50">
          <w3m-button />
          <NavLink
            to="/dashboard"
            className="text-[14px] text-[#0F160F] flex items-center py-4 my-4 px-4 hover:text-[#154A80]"
            style={({ isActive }) => (isActive ? activeStyle : null)}
            end
          >
            <CgHomeAlt className="mr-4" />
            Dashboard
          </NavLink>
          <NavLink
            to="chat"
            className="text-[14px] text-[#0F160F]  flex items-center py-4 mb-4 px-6  hover:text-[#154A80]"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <BiBox className="mr-4" /> Chat
          </NavLink>
          <NavLink
            to="createprofile"
            className="text-[14px] text-[#0F160F]  flex items-center py-4 mb-4 px-6  hover:text-[#154A80]"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <IoIosAddCircleOutline className="mr-4" />
            Create Profile
          </NavLink>
          <NavLink
            to="market_place"
            className="text-[14px] text-[#0F160F]  flex items-center py-4 mb-4 px-6  hover:text-[#154A80]"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <ImCart className="mr-4" /> Marketplace
          </NavLink>
          <NavLink
            to="notifications"
            className="text-[14px] text-[#0F160F]  flex items-center py-4 mb-4 px-6  hover:text-[#154A80]"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <BsBell className="mr-4" /> Notifications
          </NavLink>
          <NavLink
            to="transactions"
            className="text-[14px] text-[#0F160F]  flex items-center py-4 mb-4 px-6  hover:text-[#154A80]"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <BsReceipt className="mr-4" /> Transactions
          </NavLink>
          <button className="text-[14px] text-[#0F160F]  flex items-center py-4 mb-4 px-6 hover:text-[#154A80]" onClick={disconnect}>
            <TbSettings className="mr-4" /> Log out
          </button>
          <p className="lg:text-[14px] md:text-[14px] text-[14px] text-[#0F160F] items-center py-2  px-6  hover:text-[#154A80] font-bold">Wallet Address:</p>
          <p className="lg:text-[14px] md:text-[14px] text-[14px] text-[#154A80] items-center py-2  px-6  hover:text-[#0F160F]"> {address ? shortAddress : "Not connected"}</p>
          <p className="lg:text-[14px] md:text-[14px] text-[14px] text-[#0F160F] items-center py-2 px-6  hover:text-[#154A80] font-bold">You currently have:</p>
          <p className="lg:text-[14px] md:text-[14px] text-[14px] text-[#154A80] items-center py-2  px-6  hover:text-[#0F160F] "> {balance} ETH</p>
        </div>
      )}
    </header>
  );
};

export default MobileSidebar;
