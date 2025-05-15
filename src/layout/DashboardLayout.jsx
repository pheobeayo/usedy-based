import { useCallback, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppKitAccount } from '@reown/appkit/react'
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";

const DashboardLayout = () => {
  const { isConnected } = useAppKitAccount();
  const navigate = useNavigate();

  const handleRedirect = useCallback(async () => {
    if (isConnected) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect, isConnected]);
  

  return (
  

    <div>
      <div className="flex bg-white">
        <Sidebar />
        <div className="px-6 w-[100%] lg:w-[77%] md:w-[77%] h-auto lg:h-[100vh] md:h-[80vh] overflow-y-scroll">
          <MobileSidebar />
          <div className="lg:flex md:flex justify-end my-6 hidden ml-auto">
          
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
