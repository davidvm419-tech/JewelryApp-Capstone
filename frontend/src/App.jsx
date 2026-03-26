import './App.css';
import React from 'react';

//Utils functions
import {fetchSession} from "./utils";

// Utility component
import Loading from './components/loading';

// Add the url path for user friendliness
import {Routes, Route, Navigate} from "react-router-dom";

// Catalog and product routes
import LandingPage from './components/landingPage';
import Catalog from "./components/catalog";
import ProductDetails from './components/productDetails';

// Login routes
import Login from "./components/login";
import Register from "./components/register";

// Hooks
import { useEffect, useState } from 'react';

function App() {
  // Set state for user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  // Set state ofr loading to better user experience
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  const autCheck = () => {
    fetchSession().then(data => {
      setIsAuthenticated(data.is_authenticated)
      setUsername(data.username)
      setIsLoading(false)
    })
  };

  // Call useeffect to render according to status
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
        <Route path="/catalog" element={<Catalog isAuthenticated={isAuthenticated} username={username} logoutSuccess={autCheck} />}/>
        <Route path="/product/:id" element={<ProductDetails isAuthenticated={isAuthenticated} username={username} logoutSuccess={autCheck} />} />
        {/* Avoid users to login or register if they are login */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <Login loginSuccess={autCheck}/>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/catalog" replace/> : <Register registerSuccess={autCheck}/>} />
        {/* If path doesn't exists send the user to the default view */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
