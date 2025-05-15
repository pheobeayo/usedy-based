import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UseGetAllProduct from '../../Hooks/UseGetAllProduct';
import LoadingSpinner from '../../components/Loader/LoadingSpinner';
import { formatUnits } from 'ethers';
import Banner from '../../components/Banner';
import EditProduct from '../../components/EditProduct';
import BuyProduct from '../../components/BuyProduct';
import { useAppKitProvider } from '@reown/appkit/react';

const MarketplaceDetails = () => {
  const { id } = useParams();
  const allProduct = UseGetAllProduct();
  const [transaction, setTransaction] = useState(null);
  const { address } = useAppKitProvider("eip155");

  
  useEffect(() => {
    if (allProduct.length > 0) {
      const foundTransaction = allProduct.find(data => String(data?.id) === id);
      setTransaction(foundTransaction);
    }
  }, [allProduct, id]);

  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 20);
    return `${start}...`;
  };
  


  return (
    <main>
      <Banner />
      {transaction ? (
        <div className='w-[100%] mx-auto'>
          <h2 className='lg:text-[28px] md:text-[28px] text-[20px] text-[#0F160F] font-bold my-6 font-titiliumweb'>Product Details</h2>
          <section className='flex lg:flex-row md:flex-row flex-col justify-between'>
            <div className='lg:w-[45%] md:w-[45%] w-[100%]'>
              <img src={transaction.image} alt="" className='rounded-lg w-[100%]' />
            </div>
            <div className='text-[#0F160F] lg:w-[52%] md:w-[52%] w-[100%]'>
              <h3 className='font-bold mt-4 lg:mt-0 md:mt-0 lg:text-[24px] md:text-[24px] text-[20px] capitalise font-titiliumweb'>
                {transaction.name}
              </h3>
              <p className='font-titiliumweb mb-4 font-bold text-[#154A80] lg:text-[24px] md:text-[24px] text-[20px]'>
                {formatUnits(transaction.price)} ETH (per unit of measure)
              </p>
              <p className='flex justify-between my-4'>Quantity available: <span>{Number(transaction.weight)}</span></p>
              <p className='flex justify-between my-4'>Seller's location: <span>{transaction.location}</span></p>
              <p className='flex justify-between my-4'>Seller's wallet address: <span>{truncateAddress(transaction.address)}</span></p>
              {transaction.address === address && <EditProduct id={id} />}
              {transaction.address !== address && <BuyProduct id={id} price={formatUnits(transaction.price)} />}
              <p>
                Kindly drop a comment upon receipt of your products. This is crucial to ensure the seller receives their payment promptly.{' '}
                <a href="#" className='text-[#154A80] font-bold'>Learn More</a>
              </p>
            </div>
          </section>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </main>
  );
};

export default MarketplaceDetails;
