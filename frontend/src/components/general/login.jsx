import React from 'react';
import {getCookie} from "../../utils";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Login({loginSuccess}) {
    // navigation
    const navigation = useNavigate();
    // Set form state
    const [formData, setFormData] = useState({
        identification: "",
        password: "",
    });

    // Set messages state
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Effect for mesages
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage("")
                setError("")
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [message, error])

    // Handle input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    };

    // Send data to backend

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const response = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                 },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error)
                
                // Reset form values
                setFormData({
                    identification: "",
                    password: "",
                })
            } else {
                setMessage(data.message)

                // Tell react to refresh the authentication state
                if (loginSuccess) {
                    // redirect user to catalog but first wait 3 seconds to avoid react wining a race condition
                    setTimeout(() => {
                        loginSuccess()
                        navigation("/catalog")
                    }, 2000)
                }

            }
        } catch (err) {
            setError("An error has ocurried, please try again later")
        }
        
    }
    return (
        <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">   
                <form className="form-container" onSubmit={handleSubmit}>
                    
                    <h2>Welcome back!</h2>
                    
                    {/* Display messages from backend */}
                    {error && <p className="error">{error}</p>}
                    {message && <p className="message">{message}</p>}

                    <input type="text" name="identification" value={formData.identification}
                    onChange={handleChange} autoFocus placeholder="Username or email" required/>
                    <input type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Password" required/>
                    <button type="submit">Login!</button>
                    <h2 onClick={() => navigation("/register")} className="link">Don't have an account?</h2>
                </form>
            </div>
        </div>
    )
} 

export default Login;