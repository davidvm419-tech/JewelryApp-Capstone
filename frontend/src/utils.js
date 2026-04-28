/* Utility function to get a cookie value
 * Django oficial documentation:
 * https://djangoproject.com
 */

const apiBase = import.meta.env.VITE_API_URL

export function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}



// Utility function to get user status and data to the frontend
export async function fetchSession() {
    try {
        const response = await fetch(`${apiBase}/api/get_session/`, { 
          credentials: "include", 
        });
        return await response.json()
    } catch (err) {
        return {is_authenticated: false};
    }
}

// Utility function to get product data to the frontend
export async function fetchCatalog(page=1, categoryId) {
    // send fetch with category
    if (categoryId) {
        try {
            const response =await fetch(`${apiBase}/api/catalog/${categoryId}?page=${page}`, {
                credentials: "include",
            });
            const data = await response.json();
            // Return data and status true or false of response
            return {data, ok: response.ok};
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    } 

    // Send fetch without category
    try {

        const response = await fetch(`${apiBase}/api/catalog?page=${page}`, {
            credentials: "include",
        });
        const data = await response.json();
        // Return data and status true or false of response
        return {data, ok: response.ok};

    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

// Utility functions to add and delete wishlists items
export async function addToWishList(productId, csrfToken) {
    try {
        const response = await fetch(`${apiBase}/api/wishlist/add/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
        });
        const data = await response.json();
        // Return data and status true or false for response
        return {data, ok: response.ok};

    } catch (err) { 
        console.log(`Error: ${err}`)
    }
}

export async function deleteFromWishList(wishlistItemId, csrfToken) {
    try {
        const response = await fetch(`${apiBase}/api/wishlist/delete/${wishlistItemId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
        });
        const data = await response.json();
        // Return data and status true or false for response
        return {data, ok: response.ok};
    } catch (err) { 
        console.log(`Error: ${err}`)
    }
}


// Utility functions to add and delete cart items
export async function addToCart(productId, csrfToken) {

    try {
        const response = await fetch(`${apiBase}/api/cart/add/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
        });
        const data = await response.json();
        // Return data and status true or false for response
        return {data, ok: response.ok};
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

export async function deleteFromCart(cartItemId, csrfToken) {
    try {
        const response = await fetch(`${apiBase}/api/cart/delete/${cartItemId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
        })
        const data = await response.json();
        // Return data and status true or false for response
        return {data, ok: response.ok};
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}