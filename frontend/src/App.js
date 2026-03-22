import './App.css';

// Add the url path for user friendliness
import {Routes, Route} from "react-router-dom"
import Login from "./components/login"
import Register from "./components/register"
import { useEffect } from 'react';

function App() {
  useEffect(() => { 
    fetch("http://localhost:8000/api/get-csrf-token/", { 
      credentials: "include" });
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
    </div>
  );
}

export default App;
