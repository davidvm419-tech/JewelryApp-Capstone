import './App.css';
import React from 'react';

// Utils functions
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
  // API base url
  const apiBase = import.meta.env.VITE_API_URL

  // Set state for user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [cartTotalValue, setCartTotalValue] = useState(0);
  const [serviceRate, setServiceRate] = useState(0);
  const [orders, setOrders] = useState([]) 

  // Set state ofr loading to better user experience
  const [isLoading, setIsLoading] = useState(true);


  // Check authentication
  const autCheck = () => {
    fetchSession().then(data => {
      setIsAuthenticated(data.is_authenticated)
      setCsrfToken(data.token)
      // Check the status directly from the data server to avoid bugs
      if (data.is_authenticated ) {
        setUserId(data.user_id)
        setUsername(data.username)
        setWishlist(data.wishlist)
        setShoppingCart(data.shopping_cart)
        setCartTotalValue(data.cart_total_value)
        setServiceRate(data.service_rate)
        setOrders(data.orders) 
        setIsLoading(false)        
      } else {
        // Clear data if is not authenticated
          setUserId(null)
          setUsername(null)
          setWishlist([])
          setShoppingCart([])
          setCartTotalValue(0)
          setServiceRate(0)
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
          wishlist={wishlist} shoppingCart={shoppingCart} 
          wishListChange={autCheck} logoutSuccess={autCheck} />}/>
        {/* Route to specific category */}
        <Route path="/catalog/:id" element={<Catalog 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} 
          wishListChange={autCheck} logoutSuccess={autCheck} />}/>
        {/* Route to product details */}
        <Route path="/product/:id" element={<ProductDetails 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          onCartChange={autCheck} logoutSuccess={autCheck} />} />
        {/* Route to wishlist */}
        <Route path="/wishlist" element={isAuthenticated ? <Wishlist wishlist={wishlist} 
          wishListChange={autCheck} onCartChange={autCheck} /> : <Navigate to="/login" />}/>
        {/* Route to cart */}
        <Route path="/cart" element={isAuthenticated ? <ShoppingCart 
          shoppingCart={shoppingCart} cartTotalValue={cartTotalValue} serviceRate={serviceRate}
          onCartChange={autCheck} /> : <Navigate to="/login" /> }/>
        {/* Route to orders */}
        <Route path="/orders" element={isAuthenticated ? <UserOrders 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} logoutSuccess={autCheck}/>
          : <Navigate to="/login" />} />
        {/* Route to user settings */}
        <Route path="/settings" element={isAuthenticated ? <UserSettings 
          isAuthenticated={isAuthenticated} userId={userId} username={username} 
          wishlist={wishlist} shoppingCart={shoppingCart} orders={orders} 
          logoutSuccess={autCheck} /> : <Navigate to="/login" />} />
        {/* Avoid users to login or register if they are login */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <Login loginSuccess={autCheck} csrfToken={csrfToken}/>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <Register registerSuccess={autCheck} csrfToken={csrfToken}/>} />
        {/* If path doesn't exists send the user to the default view */}
        {<Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </div>
  );
}

export default App;
