function ShoppingCart({ shoppingCart }) {
    // Set states
    // Handle final checkout
    // Handle exit of the cart
    return (
        // this can be use for both wishlist and cart check tomorrow
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-72">
            <img src="product.jpg" className="h-full w-full object-cover object-center" />
        </div>
        <div className="flex flex-1 flex-col p-4">
            <h3 className="text-sm font-medium text-gray-900">
            <a href="#">Product Name</a>
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">Small description or category</p>
            <div className="flex flex-1 flex-col justify-end">
            <p className="text-base font-medium text-gray-900">$99.00</p>
            <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition">
                Add to Cart
            </button>
            </div>
        </div>
        </div>
    );
}

export default ShoppingCart