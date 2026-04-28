import React from 'react';
import {getCookie} from "../../utils";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

function Register({registerSuccess, csrfToken}) {
    // API
    const apiBase = import.meta.env.VITE_API_URL

    // navigation to login
    const navigation = useNavigate();

    // Set form state
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmation: "",
        email: "",
        name: "",
        last_name: "",
    });

    // Set messages state
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // Check valid password parametes
    const validPassword = () => {
        if (formData.password.length < 8) {
            return false;
        }
        for (let char of formData.password) {
            if (char >= "0" && char <= "9") {
                return true;
            }
        }
        return false;
    }
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

    // Handle change form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // Send data to the backend
    async function handleSubmit(e) {
        e.preventDefault()
    
        try {
            const response = await fetch(`${apiBase}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                 },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data =await response.json();

            if (!response.ok) {
                setError(data.error)
            } else {
                setMessage(data.message)

                // Reset form values
                setFormData({
                    username: "",
                    password: "",
                    confirmation: "",
                    email: "",
                    name: "",
                    last_name: "",
                })

                // Tell react to refresh the authentication state
                if (registerSuccess) {
                    // redirect user to catalog but first wait 3 seconds to avoid react wining a race condition
                    setTimeout(() => {
                        registerSuccess()
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
                    
                    <h2>Create an account</h2>
                    
                    {/* Display messages from backend */}
                    {error && <p className="error">{error}</p>}
                    {message && <p className="message">{message}</p>}

                    <input type="text" name="name" value={formData.name}
                    onChange={handleChange} autoFocus placeholder="Name" required/>
                    <input type="text" name="last_name" value={formData.last_name}
                    onChange={handleChange} placeholder="Last Name" required/>
                    <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="Email Adress"/>
                    <input type="text" name="username" value={formData.username} 
                    onChange={handleChange} placeholder="Username" required/>
                    <input type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Password" required/>
                    <input type="password" name="confirmation" value={formData.confirmation}
                    onChange={handleChange} placeholder="Confirm your password" required/>
                    {formData.password.length > 3  && formData.confirmation.length > 3 
                    && formData.password !== formData.confirmation ? (
                        <p className="text-red-600 text-sm mt-1 ml-2">Passwords do not match</p>
                    ) : null}  
                    {formData.password.length > 3 && !validPassword() ? (
                        <p className="text-red-600 text-sm mt-1 ml-2">Password must have at least 8 characters and 1 number</p>
                    ) : null}
                    <button type="submit">Register!</button>
                    <h2 onClick={() => navigation("/login")} className="link">Already registered?</h2>
                </form>
            </div>
        </div>
    );
}

export default Register