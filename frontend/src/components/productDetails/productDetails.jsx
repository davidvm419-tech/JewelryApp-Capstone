// Components
import Navbar from '../general/navbar';
import ProductImages from './productImages';
import ProductRatings from './productRatings';
import ProductComments from './ProductComments';
import ProductButtons from './productButtons';
import Footer from '../general/footer';

// Utility component
import Loading from '../general/loading';

// Hooks
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"


function ProductDetails({ isAuthenticated, userId, username,  
                        wishlist, shoppingCart, onCartChange, logoutSuccess }) {
    // Set state ofr loading to better user experience
    const [isLoading, setIsLoading] = useState(true);
    // Get id from the url
    let productId = useParams();
    productId = productId.id
    // Set state for product
    const [product, setProduct] = useState({});
    const [comments, setComments] = useState([]);
    const [images, setImages] =useState([]);
    const [ratings, setRatings] = useState([])

    // Set state for error message
    const [error, setError] = useState("")  

    // Fetch backend for data
    useEffect(()=> {
        async function fetchingProduct() {
            try {
                // Product data
                const productResponse = await fetch(`/api/product/${productId}`, {
                    credentials: "include",
                });
                const productData = await productResponse.json();
                // Images data
                const imagesResponse = await fetch(`/api/images/${productId}`, {
                    credentials: "include",
                });
                const imagesData = await imagesResponse.json(); 
                setProduct(productData)
                setComments(productData.comments)
                setRatings(productData.ratings)
                setImages(imagesData.images)
                setIsLoading(false)    


            } catch (err) {
                setError(`Error: ${err}`)
                console.log(error)
            }
        }

        fetchingProduct()
    }, [productId])

    if (isLoading) {
        return  <Loading />
    }    

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* navbar*/}
            <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
                wishlist={wishlist} shoppingCart={shoppingCart} logoutSuccess={logoutSuccess} />
            <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="bg-slate-50/50 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                            <ProductImages images={images} />
                        </div>
                         <div className="p-8 md:p-12 flex flex-col justify-center">
                             <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B3A57] mb-4">
                                {product.name}
                            </h1>
                            <div className="space-y-6">
                                <p className="text-slate-600 leading-relaxed text-lg italic">
                                    "{product.description}"
                                </p>
                                 <div className="pt-6 border-t border-slate-100 space-y-3">
                                    <p className="text-slate-500 text-sm">
                                        <span className="font-bold text-slate-700">Materials:</span> {product.materials}
                                    </p>
                                    <p className="text-3xl font-black text-slate-900">
                                        ${product.price}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    <ProductButtons isAuthenticated={isAuthenticated} productId={productId} shoppingCart={shoppingCart} onCartChange={onCartChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full">
                        <ProductRatings ratings={ratings} avg_rating={product.rating_avg} productId={productId} userId={userId} />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-medium">                
                        <ProductComments comments={comments} productId={productId} userId={userId} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ProductDetails;
