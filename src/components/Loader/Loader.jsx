import { PacmanLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#073F77]/5 bg-opacity-50">
      <PacmanLoader color="#154A80" size={60} />
    </div>
  );
};

export default Loader;
