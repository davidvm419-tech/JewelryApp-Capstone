import React from 'react';
import { useState, useEffect } from 'react';
import { fetchCatalog } from '../utils';
import { useNavigate } from "react-router-dom"

// Utility component
import Loading from '../components/loading';


function LandingPage() {
    // Set state ofr loading to better user experience
    const [isLoading, setIsLoading] = useState(true);
    // Navigation
    const navigation = useNavigate();
    // Set states
    const [products, setProducts] = useState([])

    // Call the fetch function
    useEffect(() => {
        fetchCatalog()
        .then(data => {
            // Pick 6 random images from the first page of the catalog
            const randomProducts = data.products.sort(() => Math.random() - 0.5).slice(0, 6)
            setProducts(randomProducts)
            setIsLoading(false)
        })
    },[])

    if (isLoading) {
        return  <Loading />
    }    

    return (
        <div className="min-h-screen bg-[#F4F7FA] text-[#1B3A57] flex items-center justify-center">
            <div className="container mx-auto px-6 py-12">
                <div className="container mx-auto px-6 py-12">
                    {/* title */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-[#1B3A57] tracking-wide">
                            Welcome to Geraldine Jewels
                        </h2>
                        <p className="text-[#2F6FA3] mt-3 text-lg">
                            Where you can pick your next piece
                        </p>
                    </div>
                    {/* message */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl text-[#102A40] font-medium">
                            We are prepared to give you a handcrafted jewelry experience
                        </h3>
                    </div>
                    {/* Images slider */}
                    <div className="overflow-hidden w-full py-6">
                        <div className="flex gap-6 animate-scroll whitespace-nowrap">
                            {/* Ensure a infinite loop of the random images */}
                            {[...products, ...products].map((product, index) => (
                                <img
                                    key={index}
                                    src={product.main_image}
                                    alt={product.name}
                                    className="w-64 h-64 object-cover rounded-xl 
                                    shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-[#C9D6E2]"/>
                            ))}
                        </div>
                    </div>
                    {/* Button to catalog */}
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-[#1B3A57] text-white rounded-lg hover:bg-[#102A40] 
                        transition font-semibold tracking-wide shadow-md hover:shadow-lg" onClick={() => navigation("/catalog")}>
                            Enter to a new world!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LandingPage;
