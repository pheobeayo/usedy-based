import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "../components/Loader/Loader";


const Home = lazy(() => import("../pages/Home"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const CreateSellerProfile = lazy(() => import("../pages/dashboard/CreateSellerProfile"));
const Marketplace = lazy(() => import("../pages/dashboard/Marketplace"));
const Chat = lazy(() => import("../pages/dashboard/Chat"));
const Transactions = lazy(() => import("../pages/dashboard/Transactions"));
const Notifications = lazy(() => import("../pages/dashboard/Notifications"));
const MarketplaceHome = lazy(() => import ('../pages/MarketplaceHome'))
const MarketplaceHomeDetails = lazy(() => import ('../pages/MarketplaceHomeDetails'))
const HomeLayout = lazy(() => import ('../layout/HomeLayout'))
const MarketplaceDetails = lazy(() => import('../pages/dashboard/MarketplaceDetails'))

const router = createBrowserRouter(createRoutesFromElements(

  <Route>
    <Route path="/" element={<HomeLayout />} >
    <Route index element={<Home />} />
      <Route path="/marketplace" element={<MarketplaceHome />} /> 
      <Route path="/marketplace/:id" element={<MarketplaceHomeDetails/>} /> 
    </Route>
     <Route path="/dashboard" element={<DashboardLayout />} >
      <Route index element={<Dashboard />} />
      <Route path="createprofile" element={<CreateSellerProfile />} />
      <Route path="market_place" element={<Marketplace />} />
      <Route path="market_place/:id" element={<MarketplaceDetails/>} />
      <Route path="chat" element={<Chat />} />  
      <Route path="transactions" element={<Transactions />} /> 
      <Route path="notifications" element={<Notifications />} /> 
    </Route> 
    </Route>
    ))



const AllRoutes = () => {
 

  return (
    <div className="w-full mx-auto bg-white  min-h-[100vh] font-opensans max-w-[1440px] text-[#0F160F]">
      <Toaster />
      <Suspense fallback={<Loader />}>

        <RouterProvider router={router} />

      </Suspense>
    </div>
    );
};

    export default AllRoutes;