// Util function
import {addToCart, deleteFromCart } from "../utils";

// Hooks
import { useState, useEffect } from "react";

function ProductButtons({ isAuthenticated, productId, shoppingCart, onCartChange }) {
    
    // Set states
    const [cartChange, setCartChange] = useState(shoppingCart);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // // Get if product is on user shopping cart
    const userCartProduct = cartChange.find(cart => Number(cart.product_id) === Number(productId)); 

    // Set effect for success or error messages
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setMessage("")
                setError("")
            }, 3000);
            return () => clearTimeout(timer)
        }
    }, [error, message])

    // Handle add to cart
    async function handleAdd() {
        // Send data to backend
        const {data, ok} = await addToCart(productId);
        // Get response
        if (!ok) {
            setError(data.error)
        } else {
            setCartChange(prev => [...prev, data.new_cart])
            setMessage(data.message)  
        }
        // Refresh state for userbox
        onCartChange()
    }

    // Handle delete from cart
    async function handleDelete(cartItemId) {
        // Send data to backend
        const {data, ok} = await deleteFromCart(cartItemId)
        // Get response
        if (!ok) {
            setError(data.error)
        } else {
            setCartChange( prev => prev.filter( item =>
                item.id !== userCartProduct.id)
            )
            setMessage(data.message)
        }
        // Refresh state for userbox
        onCartChange()
    }
    
    // On jsx check if user already add the product to cart or wishlist and update the state accordingly
    
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
                {isAuthenticated ? (
                    (userCartProduct ? (
                        <button className="w-full flex items-center justify-center px-8 py-4 border-red-200 text-red-600 text-sm font-bold rounded-xl 
                            hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(userCartProduct.id)}>
                            Remove from Cart
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                        </button>
                        ) : (
                            <button className="w-full flex items-center justify-center px-8 py-4 bg-[#1B3A57] text-white font-bold rounded-xl 
                                flex items-center justify-center hover:bg-[#102A40] transition-all shadow-lg hover:shadow-indigo-200"
                                onClick={() => handleAdd()}>
                                Add to Cart
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                            </button>
                        ) 
                    )
                ) : (
                    <button className="w-full px-8 py-4 bg-[#1B3A57] text-white font-bold rounded-xl 
                        flex items-center justify-center hover:bg-[#102A40] transition-all shadow-lg cursor-not-allowed shadow-none"
                        disabled={true}>
                        Please log in to add this product to your Cart.
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                    </button>
                    )
                }                
        </>
    );

}

export default ProductButtons;   
