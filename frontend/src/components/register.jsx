import getCookie from "../utils";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

function Register() {
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
    
        // Clean messages
        setError("")
        setMessage("")

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
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
            }
        } catch (err) {
            setError("An error has ocurried, please try again later")
        }
    }

    return (
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
            <button type="submit">Register!</button>
            <h2 onClick={() => navigation("/login")} className="link">Already registered?</h2>
        </form>
    );
}

export default Register