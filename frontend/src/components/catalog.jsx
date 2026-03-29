// Components
import Navbar from './navbar';
import Footer from './footer';
import Pagination from './pagination';

// Utility component
import Loading from '../components/loading';

// Hooks
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// Utils functions
import { fetchCatalog } from '../utils';

export default function Catalog({ isAuthenticated, userId, username,  wishlist, shoppingCart, orders, logoutSuccess }) {
  // Set state ofr loading to better user experience
  const [isLoading, setIsLoading] = useState(true);
  // Set states for products
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(1);  

    // Get id from the url
    let categoryId = useParams();
    categoryId = categoryId.id

  // Get backend information
  useEffect(() => {
    fetchCatalog(page, categoryId)
    .then(data => {
      setProducts(data.products)
      setPages(data.pagination)
      setIsLoading(false)
    })
  }, [page, categoryId])

  if (isLoading) {
      return  <Loading />
  }    

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* navbar*/}
      <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
        wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
        logoutSuccess={logoutSuccess} />
      
      {/* Catalog content*/}
      <main className="max-w-7xl mx-auto py-12 px-4 flex-grow">
        <section className="w-fit mx-auto grid grid-cols-1 
        lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="w-72 bg-white shadow-md rounded-xl duration-500 
              hover:scale-105 hover:shadow-xl">
                {/* Avoid crash if not image is uploaded and display a placeholder */}
                {product.main_image ? (
                  <img className="h-80 w-72 object-cover rounded-t-xl"
                    src={product.main_image}
                    alt={product.name}
                  />
                ) : (
                    <div className="h-80 w-72 bg-slate-100 flex flex-col items-center justify-center border-b border-slate-100">
                      <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-400 text-xs mt-2 font-medium">No Image</span>
                    </div>
                )}
                <div className="px-4 py-6 w-full flex flex-col items-center text-center">
                  <h2 className="text-lg font-semibold text-[#1B3A57]">{product.name}</h2>
                  {!product.rating ? (
                    <p className="text-black-400 text-sm">Product not rated yet</p>
                  ) : (
                    <p className="text-[#1B3A57] font-medium">{product.rating}</p>
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
