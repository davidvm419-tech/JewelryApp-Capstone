import './App.css';
import React from 'react';

//Utils functions
import {fetchSession} from "./utils";

// Utility component
import Loading from './components/loading';

// Add the url path for user friendliness
import {Routes, Route, Navigate} from "react-router-dom";

// Catalog and product components
import LandingPage from './components/landingPage';
import Catalog from "./components/catalog";
import ProductDetails from './components/productDetails';

// User components
import Wishlist from './components/wishlist';
import ShoppingCart from './components/shoppingCart';

// Login components
import Login from "./components/login";
import Register from "./components/register";

// Hooks
import { useEffect, useState } from 'react';

function App() {
  // Set state for user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
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
        setOrders(data.orders) 
        setIsLoading(false)        
      } else {
        // Clear data if is not authenticated
          setUserId(null)
          setUsername(null)
          setWishlist([])
          setShoppingCart([])
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
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} />}/>
        {/* Route to cart */}
        <Route path="/cart" element={<ShoppingCart shoppingCart={shoppingCart} />}/>
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
