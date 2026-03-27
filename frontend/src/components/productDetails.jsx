// Components
import Navbar from './navbar';
import ProductImages from './productImages';
import ProductRatings from './productRatings';
import ProductComments from './ProductComments';
import Footer from './footer';

// Utility component
import Loading from './loading';

import { useParams } from "react-router-dom"

// Hooks
import { useState, useEffect } from "react"


function ProductDetails({ isAuthenticated, username, userId, logoutSuccess }) {
    // Set state ofr loading to better user experience
    const [isLoading, setIsLoading] = useState(true);
    // Get id from the url
    let productId = useParams();
    productId = productId.id
    // Set state for product
    const [product, setProduct] = useState({});
    const [comments, setComments] = useState([]);
    const [images, setImages] =useState([]);
    const [ratings, setRatings] = useState([])

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
                setIsLoading(false)    


            } catch (err) {
                setError(`Error: ${err}`)
                console.log(error)
            }
        }

        fetchingProduct()
    }, [productId])

    if (isLoading) {
        return  <Loading />
    }    

    return (
        <div className="min-h-screen bg-slate-50">
        {/* navbar*/}
            <Navbar isAuthenticated={isAuthenticated} username={username} logoutSuccess={logoutSuccess} />
            <div  className="product card">
                <ProductImages images={images} />
                <h2>{product.name}</h2>
                <p>Description: {product.description}</p>
                <p>Category: {product.category}</p>
                <p>Materials: {product.materials}</p>
                <p>Price: ${product.price}</p>
                <ProductRatings ratings={ratings} avg_rating={product.rating_avg} productId={productId} userId={userId} />
                <ProductComments comments={comments} userId={userId} />
            </div>
            <Footer />
        </div>
    )
}

export default ProductDetails;