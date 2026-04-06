// Components
import Navbar from '../general/navbar';
import WishlistHeart from './wishlistHeart';
import Footer from '../general/footer';
import Pagination from './pagination';

// Utility component
import Loading from '../general/loading';

// Hooks
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// Utils functions
import { fetchCatalog } from '../../utils';

export default function Catalog({ isAuthenticated, userId, username,  
                                  wishlist, shoppingCart, wishListChange, logoutSuccess }) {
  // Set state ofr loading to better user experience
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  // Set states for products
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(1);  

    // Get id from the url
    let categoryId = useParams();
    categoryId = categoryId.id

  // Get backend information
  useEffect(() => {
    const loadData = async () => {
      const {data, ok} = await fetchCatalog(page, categoryId);
      // In case somethhing worng hhappens display a message to the user
      if (!ok) {
        setError(true)
      } else {
        
        setProducts(data.products)
        setPages(data.pagination)
      }
      setIsLoading(false)
    }

    loadData()
  }, [page, categoryId])

  if (isLoading) {
      return  <Loading />;
  }    

  // Load error in case something really bad happens
  if (error) {
    return (
      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
        <p className="font-bold">Be Warned</p>
        <p>Our store is currently unavailable, we'll be back soon!</p>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* navbar*/}
      <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
        wishlist={wishlist} shoppingCart={shoppingCart} logoutSuccess={logoutSuccess} />
      
      {/* Catalog content*/}
      <main className="max-w-7xl mx-auto py-12 px-4 flex-grow">
        <section className="w-fit mx-auto grid grid-cols-1 
        lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {products.map(product => (
            // Added div to position the wishlist heart in every card
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="relative group w-72 bg-white shadow-md rounded-xl duration-500 
                  hover:scale-105 hover:shadow-xl">
                  <WishlistHeart isAuthenticated={isAuthenticated} productId={product.id} wishlist={wishlist} wishListChange={wishListChange}/>
                  {/* Avoid crash if not image is uploaded and display a placeholder */}
                  {product.main_image ? (
                    <img className="h-80 w-72 object-cover rounded-t-xl"
                      src={product.main_image}
                      alt={product.name}
                    />
                  ) : (
                      <div className="h-80 w-72 bg-slate-100 flex flex-col items-center justify-center border-b border-slate-100 rounded-t-xl">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-slate-400 text-xs mt-2 font-medium">No Image</span>
                      </div>
                  )}
                  <div className="px-4 py-6 w-full flex flex-col items-center text-center">
                    <h2 className="text-lg font-semibold text-[#1B3A57]">{product.name}</h2>
                    {product.rating_avg === null ? (
                      <p className="text-sm font-semibold text-slate-700">Product not rated yet</p>
                    ) : (
                      <span className="text-sm font-semibold text-slate-700">Avg rating: {product.rating_avg?.toFixed(2)}</span>
                    )}
                      <p className="text-xl font-bold text-black">${product.price}</p>
                  </div>
                </div> 
              </Link>
          ))}
        </section>
        {/* Send the current page to update the state and trigger a re render */}
        <Pagination pagination={pages} setPage={setPage}/>
      </main>
      <Footer />
    </div>
  );
}
