// Util function
import {getCookie} from "../utils";

// Hooks
import { useState, useEffect } from "react";

function ProductRatings({ratings, avg_rating, productId, userId}) {
    // Rating values
    const rateValues = [1, 2, 3, 4, 5]
    
    // Set states
    const [avgChange, setAvgChange ] = useState(avg_rating);
    const [ratingChange, setRatingChange] = useState(ratings);
    const [hover, setHover] = useState(0);
    
    // Get user id to edit the rating
    const userRating = ratingChange.find(rating => rating.user_id === userId)

    // Set state for backend messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Hide and show messages when rating is added
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setError("");
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error, message]);

    // Handle adding a rating
    async function handleAddRating(ratingValue) {
        try {
            const response = await fetch(`/api/rating/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                rating: ratingValue,
            }),
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error)
        } else {
            setMessage(data.message)
            setAvgChange(data.new_avg)
            setRatingChange(prev => [...prev, data.new_rating])
        }
        } catch (err) {
            setError(`Error: ${err}`)
        }
    }

    // Handle editing a rating
     async function handleUpdateRating(ratingValue) {
            try {
                const response = await fetch(`/api/rating/edit/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({
                    rating: ratingValue,
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error)
            } else {
                setMessage(data.message)
                setAvgChange(data.new_avg)
                // Update rating instead of append the rating
                setRatingChange(prev => 
                    prev.map(rating => rating.user_id === userId ? data.new_rating : rating)
                )
            }
        } catch (err) {
            setError(`Error: ${err}`)
        }
    }
    return (
        <div className="ratings">
            {/* Display messages from backend */}
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}
            {/* Display rating information */}
            {!avgChange ? <p>Product not rated yet!</p> : 
            <p>Average Rating: {avgChange}</p>}
            {ratingChange.length <= 0 
                ? "" : 
                ratingChange.map(rating => (
                    <div key={rating.id} className="rating content">
                        <p>{rating.username}</p>
                        <p>Rating: {rating.rating}</p>
                        <p>{rating.created_at}</p>
                    </div>
            ))}
            {/* Dinamyc stars for rating  add */}
            <div className="add a rating">
                {/* Adapted from: 
                https://medium.com/javarevisited/building-a-simple-star-rating-component-in-react-69035d94c2ed 
                Optional chaining ?. stops and return undefined 
                */}
                {userId ? 
                <div className="flex items-center space-x-1">  
                {rateValues.map((rateValue) => (
                    <svg key={rateValue} onMouseEnter={() => setHover(rateValue)} onMouseLeave={() => setHover(0)} 
                    onClick={() => userRating ? handleUpdateRating(rateValue) : handleAddRating(rateValue)}
                    className={`w-5 h-5 cursor-pointer ${(hover || (userRating?.rating || 0 )) >= rateValue ? "text-yellow-400" : "text-gray-500"}`} 
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/>
                    </svg>
                ))}
                </div>: 
                `Please log in to rate the product`}
            </div>
        </div>
    )
}

export default ProductRatings;
