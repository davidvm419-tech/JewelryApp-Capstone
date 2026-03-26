// Components
import Navbar from './navbar';
import Footer from './footer';

import { useParams } from "react-router-dom"

// Hooks
import { useState, useEffect } from "react"


function ProductDetails({ isAuthenticated, username, logoutSuccess }) {
    // Get id from the url
    let productId = useParams();
    productId = productId.id
    // Set state for product
    const [product, setProduct] = useState({});
    const [comments, setComments] = useState([]);
    const [images, setImages] =useState([]);
    const [ratings, setRatings]= useState([])

    // Set state for error message
    const [error, setError] = useState("")  

    // Fetch backend for data
    useEffect(()=> {
        async function fetchingProduct() {
            try {
                // Product data
                const productResponse = await fetch(`/api/product/${productId}`, {
                    credentials: "include",
                });
                const productData = await productResponse.json();
                // Images data
                const imagesResponse = await fetch(`/api/images/${productId}`, {
                    credentials: "include",
                });
                const imagesData = await imagesResponse.json(); 
                setProduct(productData)
                setComments(productData.comments)
                setRatings(productData.ratings)
                setImages(imagesData.images)

            } catch (err) {
                setError(`Error: ${err}`)
            }
        }

        fetchingProduct()
    }, [productId])

    return (
        <div className="min-h-screen bg-slate-50">
        {/* navbar*/}
            <Navbar isAuthenticated={isAuthenticated} username={username} logoutSuccess={logoutSuccess} />
            <div  className="product card">
                <div className="image">
                    {images.length <= 0 ? <img src={product.main_image} /> : images.map(image => (
                        <div key={image.id} className="images slider">
                            <img src={image.image} alt={image.alt_text}/>
                        </div>
                    ))}
                </div>
                <h2>{product.name}</h2>
                <p>Description: {product.description}</p>
                <p>Category: {product.category}</p>
                <p>Materials: {product.materials}</p>
                <p>Price: ${product.price}</p>
                {!product.rating_avg ? <p>Product not rated yet!</p> : <p>Average Rating: {product.rating_avg}</p>}
                <div className="ratings">
                    {ratings.length <= 0 ? "" : ratings.map(rating => (
                        <div key={rating.id} className="rating content">
                            <p>{rating.username}</p>
                            <p>Rating: {rating.rating}</p>
                            <p>Rated at: {rating.created_at}</p>
                        </div>
                    ))}
                </div>
                <div className="comments">
                    {comments.length <= 0 ? <p>No comments added yet!</p> : comments.map(comment => (
                        <div key={comment.id} className="comments content">
                            <p>{comment.username}</p>
                            <p>{comment.comment}</p>
                            <small>Commented at: {comment.created_at}</small>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProductDetails