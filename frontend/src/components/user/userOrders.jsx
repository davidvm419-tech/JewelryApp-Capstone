// Utils
import { getCookie } from "../../utils";

// Utility component
import Loading from '../general/loading';

// Components
import Navbar from '../general/navbar';
import Footer from '../general/footer';
import Pagination from '../products/pagination';

// Hooks
import { useState, useEffect } from 'react';

function UserOrders({ isAuthenticated, userId, username,  
                    wishlist, shoppingCart, logoutSuccess, csrfToken }) {
    // API
    const apiBase = import.meta.env.VITE_API_URL
    
    // Set states
    const [orders, setOrders] = useState([]);
    const [pages, setPages] = useState({});
    const [page, setPage] = useState(1); 
    const [isLoading, setIsLoading] = useState(true);

    // Effect for orders change and pagination
    useEffect(()=> {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${apiBase}/api/orders?page=${page}`, { 
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Network error")
                }

                const data =await response.json()
                setOrders(data.orders)
                setPages(data.pagination)

            } catch (error) {
                console.log(`Error ${error}`)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()

    }, [page])

    if (isLoading) {
        return  <Loading />    
    }
    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* navbar*/}
            <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
                wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
                logoutSuccess={logoutSuccess} csrfToken={csrfToken} />
                {/* Order hostory container */}
                <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-6">
                <h2 className="text-3xl font-black text-[#1B3A57] mb-8">Orders History</h2>
                {/* Order general information */}
                <div className="space-y-8">
                    {orders.length > 0 ? (
                        orders.map(order => (
                        <div key={order.id} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                            <div className="flex flex-row justify-between items-center p-6 bg-slate-50/50 border-b border-slate-100">
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-[#102A40] font-bold">Order Number</p>
                                    <p className="text-sm font-black text-[#1B3A57] mt-1">{order.order_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#102A40] font-bold">Order Date</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{order.created_at}</p>
                                </div>
                            </div>
                            {/* Order items */}
                            <div className="divide-y divide-slate-100">
                                {order.items?.map(item => (
                                    <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-slate-50/30 transition-colors">
                                        <div className="w-24 h-24 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0">
                                            <img className="w-full h-full object-cover" src={item.product_image} alt={item.product_name} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-md font-extrabold text-slate-800 group-hover:text-[#1B3A57] transition-colors">
                                                {item.product_name}
                                            </h4>
                                            <p className="text-sm font-bold text-slate-400 mt-2">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900">${item.price_at_purchase}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Order total*/}
                            <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#1B3A57] font-bold text-sm uppercase">Total Amount:</span>
                                    <span className="text-2xl font-black text-[#1B3A57]">{order.total_price}</span>
                                </div>
                            </div> 
                        </div>   
                    ))
                    ) : (
        <div className="flex flex-col items-center justify-center pt-24 pb-12 w-full">
            <div className="max-w-md w-full flex flex-col items-center justify-center py-20 bg-white/40 
                backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm px-10">
                

                <div className="text-4xl mb-4 opacity-30">📦</div>

                <p className="text-slate-400 font-extrabold text-xl tracking-tight text-center leading-relaxed">
                    You have no order history. <br/>
                    <span className="text-sm font-bold opacity-80">Make your first purchase today!</span>
                </p>
            </div>
        </div>
                    )}
                </div>
            </div>
                {/* Send the current page to update the state and trigger a re render */}
                <Pagination pagination={pages} setPage={setPage}/>
            <Footer />
                
        </div>
    );
}

export default UserOrders;
