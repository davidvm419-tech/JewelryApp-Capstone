import getCookie from "../utils";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {

    const navigation = useNavigate();
    // Set form state
    const [formData, setFormData] = useState({
        identification: "",
        password: "",
    });

    // Set messages state
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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

        // Clean messages
        setError("")
        setMessage("")

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login/`, {
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
            }
        } catch (err) {
            setError("An error has ocurried, please try again later")
        }
        
    }

    return (
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
    )
} 