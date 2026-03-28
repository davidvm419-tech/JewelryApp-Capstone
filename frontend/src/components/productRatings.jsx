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
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    
    // Get user id to edit the rating
    const userRating = ratingChange.find(rating => rating.user_id === userId);

    // Set effect for success or error messages
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
            setRatingChange(prev => [data.new_rating, ...prev])
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
                // Update ratings instead of append the rating
                setRatingChange(prev => 
                    prev.map(rating => rating.user_id === userId ? data.new_rating : rating)
                )
            }
        } catch (err) {
            setError(`Error: ${err}`)
        }
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Ratings</h3>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <span className="text-sm font-semibold text-slate-700">Avg: {avgChange || "0"}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                </div>
            </div>

            {/* Display messages from backend */}
            {error && 
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {error}
            </div>}
            {message && 
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
                {message}
            </div>}

            {/* Display rating information */}
            {!avgChange ? <p>Product not rated yet!</p> : 
            <p>Average Rating: {avgChange}</p>}
            <div className="space-y-4 mb-8">
                {ratingChange.length === 0 ? (
                    <p className="text-center text-slate-400 py-4 italic text-sm">No ratings yet. Be the first one!</p>
                ) : (
                    ratingChange.map(rating => (
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between" 
                            key={rating.id}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1B3A57] flex items-center justify-center text-white text-xs font-bold uppercase">
                                    {rating.username[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{rating.username}</p>
                                    <p className="text-[10px] text-slate-400">{rating.created_at}</p>
                                </div>
                            </div>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < rating.rating ? "text-yellow-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Dinamyc stars for rating  add 
            Adapted from: 
            https://medium.com/javarevisited/building-a-simple-star-rating-component-in-react-69035d94c2ed 
            Optional chaining ?. stops and return undefined 
            */}
            <div className="pt-6 border-t border-slate-100">
                {userId ? (
                    <div className="flex flex-col items-center justify-center 
                    p-6 bg-slate-50 rounded-lg border border-slate-100 transition-all">
                        <p className="text-[#1B3A57] text-sm font-bold mb-3 uppercase tracking-wide">
                            {userRating ? "Update your rating" : "Rate this product"}
                        </p>
                        
                        <div className="flex items-center gap-2 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            {rateValues.map((val) => (
                                <button className="focus:outline-none transition-all duration-200 hover:scale-125 active:scale-95"
                                    key={val} type="button" onMouseEnter={() => setHover(val)} onMouseLeave={() => setHover(0)}
                                    onClick={() => userRating ? handleUpdateRating(val) : handleAddRating(val)}>
                                    <svg 
                                        className={`w-10 h-10 transition-colors duration-200 ${
                                            (hover || (userRating?.rating || 0)) >= val 
                                            ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" 
                                            : "text-slate-200"
                                        }`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </button>
                            ))}
                        </div>
                        
                        {userRating && (
                            <p className="mt-3 text-[11px] text-slate-400 italic">
                                You previously rated this {userRating.rating} stars
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center">
                        <p className="text-slate-500 text-sm font-medium">Please log in to rate the product</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductRatings;
