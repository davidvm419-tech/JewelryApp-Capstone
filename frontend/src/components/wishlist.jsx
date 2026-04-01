import { useState } from "react";

function Wishlist({ wishlist }) {
    console.log(wishlist)
    // Set states
    const [wishlistChange, setWishlistChange] = useState(wishlist);
    // Handle add to cart
    // Handle exit of the wishlist
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
            {wishlistChange.map(item => (
                
                <div key={item.id}>
                    <p>{item.product_name}</p>
                    <img src={item.product_image}
                        alt={item.product_name}
                    />
                    <p>${item.price}</p>
                    <small>{item.added_at}</small>
                    <button>Add to cart</button>
                </div>
            ))}
            <h1>Wishlist</h1>
            <p>This is the wishlist page.</p>
        </div>
    );
}

export default Wishlist;