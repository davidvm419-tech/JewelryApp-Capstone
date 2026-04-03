// Components
import Navbar from '../general/navbar';
import Footer from '../general/footer';
import Pagination from '../products/pagination';

// Hooks
import { useState, useEffect } from 'react';

function UserSettings({ isAuthenticated, userId, username,  
                    wishlist, shoppingCart, orders, logoutSuccess }) {
    // Set states

    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* navbar*/}
            <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
                wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
                logoutSuccess={logoutSuccess} />
                


      
            <Footer />
        </div>
    );
}

export default UserSettings;