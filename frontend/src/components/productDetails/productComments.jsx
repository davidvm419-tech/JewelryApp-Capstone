// Util function
import {getCookie} from "../../utils";

// Hooks
import { useState, useEffect } from "react";


function ProductComments({ comments, productId, userId }) {
    // Set states
    const [commentChange, setCommentChange] = useState(comments);
    const [commentInput, setCommentInput] = useState(""); 
    const [isEditing, setIsEditing] = useState(false); 
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Check if user already commented 
    const userComment = commentChange.find(comment => Number(comment.user_id) === Number(userId));


    // Set effect for success or error messages
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => { 
                setError("") 
                setMessage("") 
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, message]);

    // 1. Handle adding a post
    async function handleAddComment() {
        try {
            const response = await fetch(`/api/comment/${productId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", 
                    "X-CSRFToken": getCookie("csrftoken"), 
                },
                body: JSON.stringify({ 
                    comment: commentInput 
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) { 
                setError(data.error) 
            } else {
                console.log(data)
                setMessage(data.message)
                setCommentChange(prev => [data.new_comment, ...prev])
                // Clear comment box
                setCommentInput("")
            }
        } catch (err) { 
            setError(`Error: ${err}`) 
        }
    }

    // 2. Handle editing a comment
    async function handleUpdateComment() {
        try {
            const response = await fetch(`/api/comment/edit/${productId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json", 
                    "X-CSRFToken": getCookie("csrftoken") 
                },
                body: JSON.stringify(
                    { comment: commentInput 
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) { 
                setError(data.error) 
            } 
            else {
                setMessage(data.message)
                // Update comments instead of append the comment
                setCommentChange(prev => 
                    prev.map(comment => comment.id === userComment.id ? data.new_comment : comment)
                )
                // Close editing form
                setIsEditing(false)
                setCommentInput("")
            }
        } catch (err) { 
            setError(`Error: ${err}`) 
        }
    }

    // 3. Handle deleting a comment
    async function handleDeleteComment(comment_id) {
        // Confirm he comment to delete
        if (!window.confirm("Delete your comment?")) return;
        try {
            const response = await fetch(`/api/comment/delete/${comment_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                // No body is a standard
                credentials: "include",
            });

            const data= await response.json()

            if (!response.ok) {
                setError(data.error)
            } else { 
                setMessage(data.message)
                // Delete comment from comments updating the ui
                setCommentChange(prev => prev.filter(comment => 
                    comment.id !== comment_id)
                )
                setCommentInput("")
                setIsEditing(false)
            }
        } catch (err) { 
            setError(`Error: ${err}`) 
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Comments</h3>
            {/* Display messages from backend */}
            {error && 
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {error}
            </div>}
            {message && 
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
                {message}
            </div>}
            {/* Display comments infomation */}
            <div className="space-y-4 mb-8">
                {commentChange.map(comment => (
                    <div key={comment.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 
                    transition-all hover:shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-full bg-[#1B3A57] flex items-center justify-center 
                             text-white text-xs font-bold uppercase">
                                {comment.username[0]}
                            </div>
                            <span className="font-semibold text-slate-900">{comment.username}</span>
                           <span className="text-xs text-slate-400">• {comment.created_at}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed pl-10">{comment.comment}</p>
                    </div>
                ))}
            </div>

            {/* Form Section */}
            <div className="pt-6 border-t border-slate-100">
                {userId ? (
                    userComment ? (
                        // if user has a comment
                        !isEditing ? (
                            <div className="flex flex-col gap-3 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                <p className="text-[#1B3A57] text-sm font-medium">You've shared your thoughts on this product.</p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-[#1B3A57] text-white text-sm font-medium rounded-lg 
                                    hover:bg-[#102A40] transition-colors"
                                    onClick={() => {setIsEditing(true) 
                                    setCommentInput(userComment.comment)
                                    }}>Edit My Comment</button>
                                    <button  className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg 
                                    hover:bg-red-50 transition-colors"
                                    onClick={() => handleDeleteComment(userComment.id)}>Delete My Comment</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <textarea className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 
                                focus:border-indigo-500 outline-none transition-all min-h-[100px]"
                                value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
                                <div className="flex gap-2">
                                    <button className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg 
                                    hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                                    disabled={!commentInput.trim()} onClick={handleUpdateComment}>Save Changes</button>
                                    <button className="px-6 py-2 text-slate-500 hover:text-slate-700 font-medium" 
                                    onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        )
                    ) : (
                        // If user hasn't a comment
                        <div className="space-y-3">
                            <textarea className="w-full p-3 rounded-lg border border-slate-300 
                            focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]" 
                            value={commentInput} 
                            onChange={(e) => setCommentInput(e.target.value)} 
                            placeholder="Add a comment..." />
                            <button className="px-6 py-2 bg-[#2F6FA3] text-white font-bold rounded-lg hover:bg-[#102A40] 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" 
                            disabled={!commentInput.trim()} onClick={handleAddComment}>Post Comment</button>
                        </div>
                    )
                ) : (
                    <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center">
                        <p className="text-slate-500 text-sm font-medium">Please log in to add a comment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductComments;
