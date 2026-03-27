function ProductImages({images}) {
    return (
        <div className="image">
            {images.length === 1 ? <img src={images[0].image} /> : images.map(image => (
                <div key={image.id} className="images slider">
                    <img src={image.image} alt={image.alt_text}/>
                </div>
            ))}
        </div>
    )
}

export default ProductImages;