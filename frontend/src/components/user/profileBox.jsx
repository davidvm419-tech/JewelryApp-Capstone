import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

//Hooks
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Util function
import { getCookie } from '../../utils';


function ProfileBox({ isAuthenticated, userId, username,  wishlist, shoppingCart, logoutSuccess }) {
    // API
    const apiBase = import.meta.env.VITE_API_URL
    const navigate = useNavigate();

    // User menu items
    const userMenu = [
        {name: `Shopping Cart (${shoppingCart?.length || 0})`, href: "/cart"},
        {name: `Wishlist (${wishlist?.length || 0})`, href: "/wishlist"},
        {name: `Orders history`, href: "/orders"},
        {name: `Settings`, href: "/settings"},
    ]
    

    // Logout
    async function handleLogout() {
        try {
            const response = await fetch(`${apiBase}/api/logout/`, {
                method: "POST",
                headers: {"X-CSRFToken": getCookie("csrftoken")},
                credentials: "include",
            });

            // Update user authentication to false
            if (response.ok) {
            // redirect user to landing page but waith 2 seconds to avoid react wining a race condition
            logoutSuccess()
            setTimeout(() => {
                navigate("/")
            }, 1000)
            }

        } catch (err) {
        alert(`Error: ${err} try again`)
        }
    }

    return (
        <>
            {isAuthenticated ? (
                <Menu as="div" className="relative ml-3">
                    <MenuButton className="relative flex rounded-full 
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 
                    px-4 py-2 hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <span>Welcome back {username}!</span>
                    </MenuButton>

                    <MenuItems transition
                    className="absolute right-0 z-50 mt-2 w-48 
                    origin-top-right rounded-md bg-[#E0F2FE] py-1 outline -outline-offset-1 outline-white/10 
                    transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 
                    data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                    {userMenu.map((item, index) => (
                        <MenuItem key={index} className="block px-4 py-2 text-sm 
                        text-black data-focus:bg-white/5 data-focus:outline-hidden
                        hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md">
                            <Link to={item.href}>
                                <p>{item.name}</p>
                            </Link>
                        </MenuItem>
                    ))}
                        <MenuItem>
                            <button
                            onClick={handleLogout}  
                            className="block px-4 py-2 text-sm text-black 
                            data-focus:bg-white/5 data-focus:outline-hidden
                            hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md">
                            Sign out
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
                ) : (
                    <div className="flex items-center gap-4">
                    {/* Login and register buttons */}
                        <button className="block px-4 py-2 text-sm text-black 
                        hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md" 
                        onClick={() => navigate("/login")}>
                            Login
                        </button>

                        <button className="block px-4 py-2 text-sm text-black 
                        hover:bg-[#E0F2FE] hover:scale-105 transition-all cursor-pointer rounded-md" 
                        onClick={() => navigate("/register")}>
                            Register
                        </button>
                    </div>
                )
            }
        </>
    );
}

export default ProfileBox;