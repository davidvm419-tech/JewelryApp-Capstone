/* Utility function to get a cookie value
 * Django oficial documentation:
 * https://djangoproject.com
 */

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



// Utility function to get user status to the frontend
export async function fetchSession() {
    try {
        const response = await fetch(`/api/get_session/`, { 
          credentials: "include", 
        });
        return await response.json()
    } catch (err) {
        return {is_authenticated: false}
    }
}

// Utility function to get product data to the frontend
export async function fetchCatalog() {
    try {
        const response = await fetch("/api/catalog?page=1/", {
            credentials: "include",
        });
        return await response.json() 
    } catch (err) {
        return `Error: ${err}`
    }
}
