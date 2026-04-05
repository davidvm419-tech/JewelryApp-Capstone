// Utils
import { deleteFromCart, getCookie } from "../../utils";

// Navigation
import { useNavigate } from "react-router-dom";

// Hooks
import { useState, useEffect } from "react";

function ShoppingCart({ shoppingCart, onCartChange, cartTotalValue, serviceRate }) {
    // Set navigation
    const navigate = useNavigate();

    // Set states
    const [cartChange, setCartChange] = useState(shoppingCart);
    const [cartTotalValueChange, setCartTotalValueChange] = useState(cartTotalValue);
    const [serviceRateChange, setServiceRateChange] = useState(serviceRate);
    const [message, setMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [error, setError] = useState("");

    // Set effect for success or error messages
    useEffect(() => {
        if (error || message || alertMessage) {
            const timer = setTimeout(() => {
                setError("")
                setMessage("")
                setAlertMessage("")
            }, 3000);
            return () => clearTimeout(timer);
        }

    }, [error, message, alertMessage])

    // Sync local cart with global cart to update quantities
    useEffect(() => {
        setCartChange(shoppingCart)
        setCartTotalValueChange(cartTotalValue)
        setServiceRateChange(serviceRate)
    }, [shoppingCart, cartTotalValue])


    // Handle quantity
    async function productQuantity(productId, quantityChange) {
        // Send data to backend
        try {
            const response = await fetch(`/api/cart/update/${productId}/${quantityChange}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                credentials: "include",
            });
            const data = await response.json();
        
            if (!response.ok) {
                setError(data.error)
            } else {
                setMessage(data.message)
                // Alert message in case of trying to get 0 items
                if (data.alert_message) {
                    setAlertMessage(data.alert_message)
                }  
            }
            // Refresh state for userbox
            onCartChange()

        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }


    // Handle delete from cart
    async function handleDelete(itemId) {
        try {
            // Send data to backend
            const {data, ok} = await deleteFromCart(itemId)
            // Get response
            if (!ok) {
                setError(data.error)
            } else {
                setCartChange( prev => prev.filter( item =>
                    item.id !== itemId)
                )
                setMessage(data.message)
            }
            // Refresh state for userbox
            onCartChange()
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    // Handle final checkout
    async function orderCreation() {
        try{
            // Send data to backend
            const response = await fetch("/api/buy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                credentials: "include",
            });

            const data = await response.json();
            // Get response
            if (!response.ok) {
                setError(data.error)
            } else {
                setMessage(data.message)
                // If everything is ok send the user to catalog
                setTimeout(() => {
                    navigate("/catalog")
                }, 3000)
            }
            // Refresh state for userbox
            onCartChange()

        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 
            bg-[#1B3A57]/60 backdrop-blur-xl transition-all duration-500">
            {/* Cart container*/}
            <div className="relative w-full max-w-5xl max-h-[85vh] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] 
                shadow-2xl border border-white/20 flex flex-col overflow-hidden">
                <div className="px-8 pt-8 pb-6 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-100">
                    <div>
                        <h1 className="text-2xl font-black text-[#1B3A57] tracking-tight">Your Shopping Cart</h1>
                    </div>
                    {/* X button to go back to prev page if cart is empty*/}
                    {cartChange.length === 0 && (
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-[#1B3A57] 
                        hover:border-slate-300 rounded-xl transition-all shadow-sm group" aria-label="Close Wishlist"
                        onClick={() => navigate(-1)}>
                            <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        )
                    }
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
                {alertMessage && 
                <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-700 text-sm rounded">
                    {alertMessage}
                </div>}
                {/* Content of cart or empty cart*/}
                {cartChange.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 w-full space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-inner">
                            {cartChange.map(item => (
                                <div key={item.id} className="relative flex items-center bg-white rounded-2xl 
                                    shadow-sm border border-slate-100 p-3 pr-6 hover:shadow-md transition-all h-36">
                                    <div className="w-28 h-28 flex-shrink-0 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={item.product_image} 
                                            alt={item.product_name} 
                                        />
                                    </div>
                                    <div className="flex-1 ml-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-extrabold text-[#1B3A57]">{item.product_name}</h3>
                                            </div>
                                            <p className="text-lg font-black text-slate-900">${item.price*item.quantity}</p>
                                        </div>

                                        {/* Product quantity and delete from cart*/}
                                        <div className="mt-4 flex items-center gap-6">
                                            <div className="mt-4 flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-6">
                                                <form className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden 
                                                    w-full sm:w-fit shadow-sm h-10 group transition-all hover:border-slate-300">
                                                    <button 
                                                        type="button" className="flex-1 sm:flex-none px-4 sm:px-3 h-full flex items-center justify-center
                                                        text-[#1B3A57] font-black hover:bg-slate-50 border-r border-slate-200 
                                                        active:bg-slate-100 transition-colors"
                                                        onClick={()=> productQuantity(item.product_id, "-")}>
                                                        <span className="text-lg">−</span>
                                                    </button>
                                                    <input 
                                                        type="number" 
                                                        value={item.quantity}
                                                        // Avoids React error
                                                        readOnly
                                                        className="w-12 sm:w-10 text-center text-sm font-extrabold text-[#1B3A57] 
                                                        focus:outline-none [appearance:textfield] 
                                                        [&::-webkit-outer-spin-button]:appearance-none 
                                                        [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
                                                    />
                                                    <button 
                                                        type="button" className="flex-1 sm:flex-none px-4 sm:px-3 h-full flex items-center justify-center
                                                        text-[#1B3A57] font-black hover:bg-slate-50 border-l border-slate-200 
                                                        active:bg-slate-100 transition-colors"
                                                        onClick={()=> productQuantity(item.product_id, "+")}>
                                                        <span className="text-lg">+</span>
                                                    </button>
                                                </form>
                                            </div>
                                            <button className="text-[10px] font-black text-[#1B3A57] hover:text-red-500 
                                                uppercase tracking-widest transition-colors"
                                                onClick={() => handleDelete(item.id)}>
                                                Remove from cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                       {/* Sumary and total prices box */}
                        <div className="w-full lg:w-96 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <h2 className="text-lg font-black text-[#1B3A57] mb-6">Order summary</h2>
                            <div className="space-y-4 text-sm border-b border-slate-100 pb-6">
                                <div className="flex justify-between items-center text-slate-500 font-bold">
                                    <span>Subtotal</span><span className="text-slate-900">${cartTotalValueChange}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-bold">
                                    <span>Service Fee</span><span className="text-slate-900">${serviceRateChange}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-6 mb-8">
                                <span className="text-base font-black text-[#1B3A57]">Order total</span>
                                <span className="text-2xl font-black text-slate-900">${cartTotalValueChange + serviceRateChange}</span>
                            </div>
                            
                            <button className="w-full py-4 bg-[#1B3A57] hover:bg-[#102A40] text-white rounded-2xl 
                                font-black text-sm transition-all shadow-xl shadow-indigo-100 active:scale-95"
                                onClick={() => orderCreation()}>
                                Buy!
                            </button>
                            <button className="w-full mt-6 text-[10px] font-black text-black 
                                hover:text-indigo-500 uppercase tracking-widest text-center"
                                onClick={() => navigate(-1)}>
                                or Continue Shopping &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Center Message for Empty Cart */
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 
                        backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 shadow-sm px-10">
                        <p className="text-slate-400 font-extrabold text-xl tracking-tight text-center">
                            Your Shopping Cart is empty, for now!
                        </p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;
