// Hooks
import { useState } from "react";

/*
 * Adapted from Flowbite Carousel Component
 * Ref: https://flowbite.com
 */

function ProductImages({ images }) {
    // Set state
    const [activeImage, setActiveImage] = useState(0);
    
    // If images are not avaliable show a placeholder instead
    if (!images || images.length === 0) {
        return (
            <div className="max-w-xl mx-auto h-64 md:h-96 bg-slate-50 rounded-xl 
            flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                <svg className="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-slate-400 font-medium">No images available</p>
            </div>
        )
    }
    
    // Allow to see the images of the product
    const nextSlide = () => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div className="relative w-full max-w-xl mx-auto" data-carousel="slide">
            {/* Carousel wrapper */}
            <div className="relative h-64 overflow-hidden rounded-xl md:h-96 bg-slate-50 border border-slate-200">
                {images.map((img, index) => (
                    <div className={`duration-700 ease-in-out absolute inset-0 transition-opacity ${
                        index === activeImage ? "opacity-100 z-20" : "opacity-0 z-10"}`} 
                        key={img.id || index}>
                        <img className="absolute block w-full h-full object-contain p-8 transition-transform duration-500" 
                            src={img.image} 
                            alt={img.alt_text || "Product"} 
                        />
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            {images.length > 1 && (
                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
                    {images.map((_, index) => (
                        <button className={`w-3 h-3 rounded-full transition-colors ${
                            index === activeImage ? "bg-[#1B3A57]" : "bg-white/50 hover:bg-white"}`}
                            key={index} onClick={() => setActiveImage(index)} aria-label={`Slide ${index + 1}`}>
                        </button>
                    ))}
                </div>
            )}

            {/* Slider controls */}
            {images.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute top-0 start-0 z-30 flex items-center justify-center 
                    h-full px-4 cursor-pointer group focus:outline-none">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg 
                        bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                            <svg className="w-5 h-5 text-[#1B3A57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </span>
                    </button>
                    <button onClick={nextSlide} className="absolute top-0 end-0 z-30 flex items-center justify-center 
                    h-full px-4 cursor-pointer group focus:outline-none">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/30 
                        group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                            <svg className="w-5 h-5 text-[#1B3A57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>
                </>
            )}
        </div>
    );
}

export default ProductImages;
