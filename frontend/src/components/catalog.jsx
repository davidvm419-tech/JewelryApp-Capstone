// Components
import Navbar from './navbar';
import Footer from './footer';
import Pagination from './pagination';

// Hooks
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Utils functions
import { fetchCatalog } from '../utils';

export default function Catalog({ isAuthenticated, username, logoutSuccess }) {
  // Set states for products
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(1);  
  // Get backend information
  useEffect(() => {
    fetchCatalog(page)
    .then(data => {
      setProducts(data.products)
      setPages(data.pagination)
    })
  }, [page])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* navbar*/}
      <Navbar isAuthenticated={isAuthenticated} username={username} logoutSuccess={logoutSuccess} />
      
      {/* Catalog content*/}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <section className="w-fit mx-auto grid grid-cols-1 
        lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="w-72 bg-white shadow-md rounded-xl duration-500 
              hover:scale-105 hover:shadow-xl">
                  <img className="h-80 w-72 object-cover rounded-t-xl"
                    src={product.main_image}
                    alt={product.name}
                  />
                <div className="px-4 py-6 w-full flex flex-col items-center text-center">
                  <h2 className="text-lg font-semibold text-[#1B3A57]">{product.name}</h2>
                  {!product.rating ? (
                    <p className="text-black-400 text-sm">Product not rated yet</p>
                  ) : (
                    <p className="text-[#1B3A57]-600 font-medium">{product.rating}</p>
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
