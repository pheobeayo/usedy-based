import UseGetAllProduct from '../Hooks/UseGetAllProduct';
import { formatUnits } from 'ethers';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from '../components/Loader/LoadingSpinner';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';

const MarketplaceHome = () => {
    const { allProduct, loading, error, refetch } = UseGetAllProduct();
    const [currentPage, setCurrentPage] = useState(1);

    // Use media query to detect screen size
    const isMobile = useMediaQuery('(max-width: 640px)');
    const itemsPerPage = isMobile ? 2 : 6;

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedProducts = allProduct.slice(startIndex, startIndex + itemsPerPage);


    const totalPages = Math.ceil(allProduct.length / itemsPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <>
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                        <button
                            onClick={refetch}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.map((product, index) => (
                            <div key={index} className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                <p className="text-gray-700 mb-1">Quantity: {product.weight}</p>
                                <p className="text-gray-700 mb-1">Seller's location: {product.location}</p>
                                <p className="text-gray-700 mb-3">Price: {formatUnits(product.price)} ETH</p>
                                <Link
                                    to={`/product/${product.id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
                                >
                                    View details
                                </Link>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MarketplaceHome;
