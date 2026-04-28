// Util functions
import { addToCart, deleteFromWishList } from "../../utils";

// Navigation
import { useNavigate } from "react-router-dom";

// Hooks
import { useState, useEffect } from "react";

function Wishlist({ wishlist, wishListChange, onCartChange, csrfToken }) {
    // Set navigator
    const navigate = useNavigate();

    // Set states
    const [wishlistChange, setWishlistChange] = useState(wishlist);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Set effect for success or error messages
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage("")
                setError("")
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error])

    // Handle add to cart
    async function handleAdd(productId, itemId) {
        // Send data to backend
        const {data, ok} = await addToCart(productId, csrfToken);
        // Get response
        if (!ok) {
            setError(data.error)
        } else {
            setWishlistChange(prev => prev.filter(item =>
                item.id !== itemId)
            )
            setMessage(data.message)  
        }
        // Refresh state for userbox
        onCartChange()    
    }

    // Handle delete
    async function handleDelete(wishlistItemId) {
        // Send data to backend
        const {data, ok} = await deleteFromWishList(wishlistItemId, csrfToken);
        // Get response
        if (!ok) {
            setError(data.error)
        } else {
            setWishlistChange(prev => prev.filter(item =>
                item.id !== wishlistItemId)
            )
            setMessage(data.message)
        }
        // Refresh state for userbox
        wishListChange()
    }

     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 
            bg-[#1B3A57]/60 backdrop-blur-xl transition-all duration-500">
            {/* wishlist container*/}
            <div className="relative w-full max-w-5xl max-h-[85vh] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] 
                shadow-2xl border border-white/20 flex flex-col overflow-hidden">
                <div className="px-8 pt-8 pb-6 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-100">
                    <div>
                        <h1 className="text-2xl font-black text-[#1B3A57] tracking-tight">Your Wishlist</h1>
                    </div>
                    {/* X button to go back to prev page*/}
                    <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-[#1B3A57] 
                    hover:border-slate-300 rounded-xl transition-all shadow-sm group" aria-label="Close Wishlist"
                    onClick={() => navigate(-1)}>
                        <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {/* Display messages from backend */}
                    {error && 
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                        {error}
                    </div>}
                    {message && 
                    <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
                        {message}
                    </div>}
                   {/* Conditional rendering of div for empty wihslist*/}
                    <div className={`flex-1 p-8 ${wishlistChange.length > 0 ? "overflow-y-auto" : "flex items-center justify-center"}`}>
                        {wishlistChange.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 bg-slate-50 
                                rounded-3xl border border-slate-200 shadow-inner">
                                {wishlistChange.map(item => (
                                    <div key={item.id} 
                                        // Content 
                                        className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 p-2 pr-4 
                                        hover:shadow-md transition-all group h-28">
                                        <div className="w-24 h-24 flex-shrink-0 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                                            <img 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                src={item.product_image}
                                                alt={item.product_name}
                                            />
                                        </div>
                                        <div className="flex-1 ml-4 pr-6"> 
                                            <h3 className="text-sm font-extrabold text-[#1B3A57] line-clamp-1 leading-tight">
                                                {item.product_name}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
                                                {item.added_at}
                                            </p>
                                            <div className="mt-1">
                                                <span className="text-lg font-black text-slate-900">${item.price}</span>
                                            </div>
                                        </div>
                                        {/* Delete button*/}
                                        <button className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                        onClick={() => handleDelete(item.id)}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        {/* Add to cart button*/}
                                        <button className="absolute bottom-0 right-0 bg-[#1B3A57] text-white p-2.5 rounded-tl-2xl 
                                        hover:bg-[#102A40] transition-all shadow-sm"
                                        onClick={() => handleAdd(item.product_id, item.id)}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-xl w-full text-center py-24 bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed 
                            border-slate-200 shadow-sm flex items-center justify-center px-10">
                                <p className="text-slate-400 font-extrabold text-xl tracking-tight">
                                    Your Wishlist is empty, for now!
                                </p>
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wishlist;
