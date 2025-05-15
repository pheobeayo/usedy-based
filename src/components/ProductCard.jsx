import { Link } from 'react-router-dom'
import UseGetAllProduct from '../Hooks/UseGetAllProduct';
import { formatUnits } from 'ethers';


const ProductCard = () => {
  const allProduct = UseGetAllProduct()
  console.log(allProduct)
  



  return (
    <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 flex-wrap">
      {allProduct.map((info) => (
        <div className="lg:w-[32%] md:w-[32%] w-[100%] p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg"
        >
          <Link
            to={`/dashboard/market_place/${info.id}`}
            key={info.id}
            className="text-[#0F160F]"
          >
            <img
              src={info.image}
              alt=''
              className="w-[100%] h-[237px] object-cover object-center rounded-lg"
            />
            <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalize">
              {info.name}
            </h3>
            <p className="flex justify-between my-4">
              Quantity <span>{Number(info.weight)} kg</span>
            </p>
            <p className="flex justify-between my-4">
              Seller's location <span>{info.location}</span>
            </p>
            <p className="flex justify-between my-4 font-bold">
              Price <span>{formatUnits(info.price)} ETH</span>
            </p>
            <button className="my-4 border w-[100%] py-2 px-4 border-[#154A80] text-[#154A80] rounded-lg">
              View details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
