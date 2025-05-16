import image1 from "../assets/heroimage1.svg";
import image2 from "../assets/heroimage2.svg";
import bgImg from "../assets/ornament.svg";
import MarketplaceHome from "./MarketplaceHome";
import About from "./About";

const Home = () => {
  return (
    <main>
      <section className="bg-[#073F77]/5 relative py-6">
        <div className="lg:w-[70%] md:w-[70%] w-[100%] mx-auto text-center my-12 px-4 lg:px-0 md:px-0">
          <h1 className="lg:text-[50px] md:text-[50px] text-[28px] font-[700] my-4 font-playfair">
            Empower sustainable climate action through a decentralized marketplace for used and reuseable products
          </h1>
          <p className="lg:text-[24px] md:text-[24px] text-[18px] text-[#0F160F]/80">
            Trade recyclables on the blockchain, earn rewards, and power the
            green revolution with every sale and purchase
          </p>
          <div className="mt-6">
            <button className="bg-[#154A80] rounded-lg p-4 text-white mr-4 lg:text-[20px] md:text-[20px] text-[18px]">
              Sell Products
            </button>
            <button className="border border-[#154A80] rounded-lg p-4 text-[#154A80] bg-white lg:text-[20px] md:text-[20px] text-[18px]">
              Buy Products
            </button>
          </div>
        </div>
        <div className="lg:w-[500px] lg:h-[500px] md:w-[500px] md:h-[500px] w-[250px] h-[250px] bg-[#015C28]/20 blur-[80px] absolute top-0 left-0 rounded-full"></div>
        <div className="flex flex-col lg:flex-row md:flex-row justify-between lg:w-[90%] md:w-[90%] w-[100%] mx-auto mb-10">
          <div className="flex justify-between items-center lg:w-[45%] md:w-[45%]w-[100%]">
            <img src={bgImg} alt="" className="hidden lg:block md:block" />
            <img src={image2} alt="" className=" ml-auto mb-4" />
          </div>
          <div className="flex justify-between items-center lg:w-[52%] md:w-[52%] w-[100%] ">
            <img src={image1} alt="" className="mr-auto" />
            <img src={bgImg} alt="" className="hidden lg:block md:block" />
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="lg:w-[90%] md:w-[90%] w-[100%] mx-auto">
          <h2 className="lg:text-[32px] md:text-[32px] text-[24px] font-[700] text-[#154A80] lg:w-[70%] md:w-[70%] w-[100%] my-12 font-titiliumweb text-center lg:text-left md:text-left">
            Welcome to Usedy, where environmental consciousness meets
            blockchain innovation
          </h2>
          <div className="flex flex-col lg:flex-row md:flex-row justify-between">
            <div className="py-6 border-t-2 border-[#154A80] lg:w-[30%] md:w-[30%] w-[90%] mx-auto mb-4">
              <h3 className="lg:text-[24px] md:text-[24px] text-[18px] font-[700] font-titiliumweb mb-4">
                Tangible Rewards
              </h3>
              <p>
                Recycling is now more rewarding than ever. Earn tokens for every
                eco-conscious action you take.
              </p>
            </div>
            <div className="py-6 border-t-2 border-[#154A80] lg:w-[30%] md:w-[30%] w-[90%] mx-auto mb-4">
              <h3 className="lg:text-[24px] md:text-[24px] text-[18px] font-[700] font-titiliumweb mb-4">
                Be a Part of the Future
              </h3>
              <p>
                Usedy harnesses the potential of blockchain and technology for a better world.
              </p>
            </div>
            <div className="py-6 border-t-2 border-[#154A80] lg:w-[30%] md:w-[30%] w-[90%] mx-auto mb-4">
              <h3 className="lg:text-[24px] md:text-[24px] text-[18px] font-[700] font-titiliumweb mb-4">
                Simple and Engaging
              </h3>
              <p>
                Usedy makes sustainability accessible and engaging. Embrace the future of sustainability
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className=" my-10">
        <h2 className="px-4 lg:px-0 md:px-0 lg:text-[32px] md:text-[32px] text-[24px] font-[700] my-6 flex justify-between flex-col lg:flex-row md:flex-row  w-[90%] mx-auto font-titiliumweb items-center text-center lg:text-left md:text-left">Recyclable materials for sale (Prices are in Unit of Measure) <span className="lg:text-[24px] md:text-[24px] text-[18px] font-[400]">View More</span></h2>
        <MarketplaceHome />
      </section>
      <section id="about-us" className="lg:w-[90%] md:w-[90%] w-[100%] mx-auto my-14">
        <About />
      </section>
    </main>
  );
};

export default Home;
