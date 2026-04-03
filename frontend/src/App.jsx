import './App.css';
import React from 'react';

//Utils functions
import {fetchSession} from "./utils";

// Utility component
import Loading from './components/general/loading';

// Add the url path for user friendliness
import {Routes, Route, Navigate} from "react-router-dom";

// Catalog and product components
import LandingPage from './components/general/landingPage';
import Catalog from "./components/products/catalog";
import ProductDetails from './components/productDetails/productDetails';

// User components
import Wishlist from './components/user/wishlist';
import ShoppingCart from './components/user/shoppingCart';
import UserOrders from './components/user/userOrders';
import UserSettings from './components/user/userSettings';

// Login components
import Login from "./components/general/login";
import Register from "./components/general/register";

// Hooks
import { useEffect, useState } from 'react';

function App() {
  // Set state for user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [cartTotalValue, setCartTotalValue] = useState(0);
  const [orders, setOrders] = useState([]) 

  // Set state ofr loading to better user experience
  const [isLoading, setIsLoading] = useState(true);


  // Check authentication
  const autCheck = () => {
    fetchSession().then(data => {
      setIsAuthenticated(data.is_authenticated)
      
      // Check the status directly from the data server to avoid bugs
      if (data.is_authenticated ) {
        setUserId(data.user_id)
        setUsername(data.username)
        setWishlist(data.wishlist)
        setShoppingCart(data.shopping_cart)
        setCartTotalValue(data.cart_total_value)
        setOrders(data.orders) 
        setIsLoading(false)        
      } else {
        // Clear data if is not authenticated
          setUserId(null)
          setUsername(null)
          setWishlist([])
          setShoppingCart([])
          setCartTotalValue(0)
          setOrders([])
          setIsLoading(false)
      }
    })
  };

  // Call useEffect to render according to status
  useEffect(() => {
    autCheck()  
  }, []) 

  if (isLoading) {
    return  <Loading />    
  }

  return (
    <div className="App">
      <Routes>
        {/* Check if user is login or not to send to the right view */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <LandingPage />} />
        {/* Route to catalog */}
        <Route path="/catalog" element={<Catalog 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          wishListChange={autCheck} logoutSuccess={autCheck} />}/>
        {/* Route to specific category */}
        <Route path="/catalog/:id" element={<Catalog 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          wishListChange={autCheck} logoutSuccess={autCheck} />}/>
        {/* Route to product details */}
        <Route path="/product/:id" element={<ProductDetails 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          onCartChange={autCheck} logoutSuccess={autCheck} />} />
        {/* Route to wishlist */}
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} 
          wishListChange={autCheck} onCartChange={autCheck} />}/>
        {/* Route to cart */}
        <Route path="/cart" element={<ShoppingCart shoppingCart={shoppingCart} cartTotalValue={cartTotalValue}
          onCartChange={autCheck} />}/>
        {/* Route to orders */}
        <Route path="/orders" element={<UserOrders 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          logoutSuccess={autCheck}/>} />
        {/* Route to user settings */}
        <Route path="/settings" element={<UserSettings 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          logoutSuccess={autCheck}/>} />
        {/* Avoid users to login or register if they are login */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <Login loginSuccess={autCheck}/>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <Register registerSuccess={autCheck}/>} />
        {/* If path doesn't exists send the user to the default view */}
        {<Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </div>
  );
}

export default App;
