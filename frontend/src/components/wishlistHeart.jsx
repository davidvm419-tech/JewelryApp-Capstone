// Util function
import {addToWishList, deleteFromWishList, fetchSession} from "../utils";

// Hooks
import { useState, useEffect } from "react";

function WishlistHeart({ isAuthenticated, productId, wishlist, wishListChange}) {
    
    // Set states
    const [wishChange, setWishChange] =useState(wishlist);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Get if product is on user wishlist
    const userWishProduct = wishChange.find( wish => Number(wish.product_id) === Number(productId));

    // Set effect for success or error messages
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setError("");
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error, message]);


    // Handle add to wishlist
    async function handleAdd(e) {
        // Prevents going to product details whhen clicking the wishlist heart
        e.preventDefault()
        e.stopPropagation()
        // Send data to backend
        const {data, ok} = await addToWishList(productId);
        // Get response
        if (!ok) {
            setError(data.error)
        } else {
            setWishChange(prev => [...prev, data.new_wishlist])
            setMessage(data.message)
        }
        // Refresh state for userbox
        wishListChange()
    }

    // Handle delete from wishlist
    async function handleDelete(e, wishlistItemId) {
        // Prevents going to product details whhen clicking the wishlist heart
        e.preventDefault()
        e.stopPropagation()
        // Send data to backend
        const {data, ok} = await deleteFromWishList(wishlistItemId);
        // Get response
        if (!ok) {
            setError(data.error)
        } else {
            setWishChange(prev => prev.filter(item =>
                item.id !== userWishProduct.id)
            )
            setMessage(data.message)
        }
        // Refresh state for userbox
        wishListChange()
    }

    return (
        <>
        {/* Display messages from backend */}
        {error && 
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
        </div>}
        {message && 
        <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
            {message}
        </div>}
            <div className="absolute top-3 right-3 z-20">
                {isAuthenticated ? (
                    // Check if user has the product in wishlist
                    (userWishProduct ? (         
                        <button className="p-1 bg-white/80 rounded-full shadow-sm"
                        onClick={(e) => handleDelete(e, userWishProduct.id)}>
                            <svg className="w-4 h-4 fill-[#1B3A57] text-[#1B3A57] opacity-100"
                            viewBox="0 0 24 24" 
                            stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    ) : (         
                        <button className="p-1 bg-white/80 rounded-full shadow-sm opacity-90 hover:opacity-100"
                            onClick={(e) => handleAdd(e)}>
                            <svg className="w-4 h-4 text-gray-200 fill-gray-200 opacity-90 hover:fill-[#1B3A57] 
                            hover:text-[#1B3A57] hover:opacity-100"
                            viewBox="0 0 24 24" 
                            stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        )
                    )
                ) : (
                    <button className="p-1 bg-white/80 rounded-full shadow-sm opacity-90 cursor-not-allowed shadow-none"
                        disabled={true}>
                        <svg className="w-4 h-4 text-gray-200 fill-gray-200 opacity-90"
                        viewBox="0 0 24 24" 
                        stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    )
                }
            </div>
        </>
    );
}

export default WishlistHeart;   
