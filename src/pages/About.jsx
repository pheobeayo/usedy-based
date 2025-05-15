import aboutimage from "../assets/aboutimage.svg";

const About = () => {
  return (
    <div>
      <h2 className="text-[#154A80] lg:text-[36px] md:text-[36px] text-[26px] font-[700] my-8 text-center mb-12">
        How Usedy work
      </h2>
      <div>
        <div className="flex justify-between flex-col lg:flex-row md:flex-row items-center px-4 lg:px-0 md:px-0">
            <ul className="text-[#0F160F]/70 lg:w-[50%] md:w-[50%] w-[90%]">
                <li className="lg:text-[24px] md:text-[24px] text-[18px] list-disc mb-4 "><strong>Sign Up and Get Started</strong>: Begin by signing up on the Usedy platform. Join a community of eco-conscious individuals dedicated to making a positive impact on the environment.</li>
                <li className="lg:text-[24px] md:text-[24px] text-[18px] list-disc mb-4 "><strong>Proceed to sell or buy button to post or buy Recyclable Products</strong>: Provide details about the recyclable materials you want to sell including images, type, quality, price in cryptocurrency, and location</li>
                <li className="lg:text-[24px] md:text-[24px] text-[18px] list-disc mb-4 "><strong>Users get directed based on the buy or sell button</strong>: If you are a buyer, proceed to the marketplace page to check the recyclable products available for sale. And for sellers, proceed to post your products</li>
                <li className="lg:text-[24px] md:text-[24px] text-[18px] list-disc mb-4 "><strong>Secure Blockchain Payment</strong>: As a buyer your payment is secured on the blockchain. Escrow service holds cryptocurrency until a buyer confirms receipt of recyclable materials</li>
            </ul>
            <div className="lg:w-[45%] md:w-[45%] w-[100%]">
                <img src={aboutimage} alt="" className="w-[100%]"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
