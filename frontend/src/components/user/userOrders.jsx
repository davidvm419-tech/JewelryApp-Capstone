// Components
import Navbar from '../general/navbar';
import Footer from '../general/footer';
import Pagination from '../products/pagination';

// Hooks
import { useState, useEffect } from 'react';

function UserOrders({ isAuthenticated, userId, username,  
                    wishlist, shoppingCart, orders, logoutSuccess }) {
    // Set states
    const [ordersChange, setOrdersChange] = useState([orders]);
    const [pages, setPages] = useState({});
    const [page, setPage] = useState(1); 
    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* navbar*/}
            <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
                wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
                logoutSuccess={logoutSuccess} />
            <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
                <h2 className="text-3xl font-black text-[#1B3A57] mb-8">Order History</h2>

                {/* ORDERS POSIBLE STYLE */}
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                    
        
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 border-b border-slate-100">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Order Number</p>
                        <p className="text-sm font-black text-[#1B3A57] mt-1">#2583319083</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Order Date</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">Jan 18, 2024</p>
                    </div>

                    </div>

         
                    <div className="divide-y divide-slate-100">
       
                    <div className="p-6 flex items-center gap-6 group hover:bg-slate-50/30 transition-colors">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0">
                        <img src="https://placeholder.com" alt="Product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                        <h4 className="text-md font-extrabold text-slate-800 group-hover:text-[#1B3A57] transition-colors">
                            Premium Cotton T-Shirt
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">Size: M | Color: Black</p>
                        <p className="text-sm font-bold text-slate-400 mt-2">Qty: 2</p>
                        </div>
                        <div className="text-right">
                        <p className="text-lg font-black text-slate-900">$160.00</p>
                        </div>
                    </div>

 
                    </div>

       
                    <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold text-sm uppercase">Total Amount:</span>
                        <span className="text-2xl font-black text-[#1B3A57]">$180.00</span>
                    </div>

                    </div>
                </div>
            </div>
                {/* Send the current page to update the state and trigger a re render */}
                <Pagination pagination={pages} setPage={setPage}/>
            <Footer />
                
        </div>
    );
}

export default UserOrders;