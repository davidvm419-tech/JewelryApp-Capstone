// Utils
import { getCookie } from "../../utils";

// Utility component
import Loading from '../general/loading';

// Components
import Navbar from '../general/navbar';
import Footer from '../general/footer';

// Hooks
import { useState, useEffect } from 'react';

function UserSettings({ isAuthenticated, userId, username,  
                    wishlist, shoppingCart, logoutSuccess }) {

    // Set states
    const [userData, setUserData] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Effect for mesages
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage("")
                setError("")
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [message, error])

    
    // Effect to fetch user data
    useEffect(() => {
        fetch("/api/user/settings", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
            },
            credentials: "include",
        })
        .then(response => response.json())
        .then(data => {
            setUserData(data.user_data)
            setIsLoading(false)
        })
    }, [])


    // Effect to set messages

    // Handle update names

    // Handle update email

    // Handle update password

   if (isLoading) {
        return  <Loading />    
    }
    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar isAuthenticated={isAuthenticated} userId={userId} username={username} 
                wishlist={wishlist} shoppingCart={shoppingCart} 
                logoutSuccess={logoutSuccess} />

            <div className="max-w-6xl mx-auto p-6 mt-10 w-full flex-grow">
                <div className="mb-10 ml-4">
                    <h1 className="text-4xl font-black text-[#1B3A57] tracking-tight">Account Settings</h1>
                </div>
                {/* Display messages from backend */}
                        {error && 
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {error}
                        </div>}
                        {message && 
                        <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
                            {message}
                        </div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    
                    {/* Profile information */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#F0F9FF] border border-blue-200 rounded-[2.5rem] p-8 text-[#1B3A57] shadow-sm sticky top-10">
                            <div className="w-20 h-20 bg-[#1B3A57] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#1B3A57]/30">
                                <span className="text-3xl font-black text-white">{userData.username_first_char}</span>
                            </div>
                            <h3 className="text-2xl font-black mb-1 tracking-tight">{userData.username}</h3>
                            <div className="space-y-5 border-t border-blue-200 pt-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-800 font-black uppercase text-[9px] tracking-widest">Name</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-black text-slate-800 uppercase italic">{userData.complete_name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-800 font-black uppercase text-[9px] tracking-widest">Member Since</span>
                                    <span className="text-sm font-black text-slate-800 uppercase italic">{userData.member_since}</span>
                                </div>
                            </div>
                            {/* User activity */}
                            <div className="mt-8 grid grid-cols-3 gap-3">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white text-center shadow-sm">
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter mb-1">Orders</p>
                                    <p className="text-sm font-black text-[#1B3A57]">{userData.orders_quantity}</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white text-center shadow-sm">
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter mb-1">Comments</p>
                                    <p className="text-sm font-black text-[#1B3A57]">{userData.comments_quantity}</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white text-center shadow-sm">
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter mb-1">Products Rated</p>
                                    <p className="text-sm font-black text-[#1B3A57]">{userData.ratings_quantity}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-10">
                        {/* Personal information */}
                        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                            <h3 className="text-xl font-black text-[#1B3A57] mb-8">Personal Details</h3>
                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-800 font-black ml-4">First Name</label>
                                        <input type="text" className="w-full px-6 py-4 bg-slate-100 border border-transparent outline-none 
                                        ring-0 focus:ring-2 focus:ring-[#1B3A57] focus:bg-white rounded-2xl 
                                        transition-all font-bold text-slate-700" defaultValue={userData.first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-800 font-black ml-4">Last Name</label>
                                        <input type="text" className="w-full px-6 py-4 bg-slate-100 border border-transparent outline-none 
                                        ring-0 focus:ring-2 focus:ring-[#1B3A57] focus:bg-white rounded-2xl 
                                        transition-all font-bold text-slate-700" defaultValue={userData.last_name} />
                                    </div>
                                </div>
                                <button className="px-12 py-5 bg-[#1B3A57] text-white font-black rounded-2xl hover:scale-[1.02] 
                                    transition-all shadow-lg active:scale-95">
                                    Update Personal Information
                                </button>
                            </form>
                        </div>
                        {/* Email Update */}
                        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                            <h3 className="text-xl font-black text-[#1B3A57] mb-2">Email Address</h3>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8 ml-1">Change your email</p>
                            <form className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-red-700 font-black ml-4">Current Email</label>
                                    <input className="w-full px-6 py-4 bg-blue-50/50 border border-transparent 
                                    outline-none ring-0 focus:ring-2 focus:ring-[#1B3A57] 
                                    focus:bg-white rounded-2xl transition-all font-bold text-slate-700" 
                                    type="email" placeholder="Enter current email" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-800 font-black ml-4">New Email</label>
                                        <input className="w-full px-6 py-4 bg-slate-100 border border-transparent 
                                        outline-none ring-0 focus:ring-2 focus:ring-[#1B3A57] 
                                        focus:bg-white rounded-2xl font-bold text-slate-700" type="email" placeholder="New email"/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-800 font-black ml-4">Confirm New Email</label>
                                        <input className="w-full px-6 py-4 bg-slate-100 border border-transparent
                                         outline-none ring-0 focus:ring-2 focus:ring-[#1B3A57] 
                                         focus:bg-white rounded-2xl font-bold text-slate-700" type="email" placeholder="Confirm email" />
                                    </div>
                                </div>
                                <button className="px-12 py-5 bg-[#1B3A57] text-white font-black rounded-2xl hover:scale-[1.02] 
                                    transition-all shadow-lg">
                                    Update Email
                                </button>
                            </form>
                        </div>
                        {/* Password Update */}
                        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                            <h3 className="text-xl font-black text-[#1B3A57] mb-2">Security</h3>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8 ml-1">Change your password</p>
                            <form className="space-y-8">
                                <div className="space-y-2 border-b border-slate-100 pb-8 mb-8">
                                    <label className="text-[10px] uppercase tracking-widest text-red-700 font-black ml-4">Current Password</label>
                                    <input className="w-full px-6 py-4 bg-blue-50/50 border border-transparent 
                                    outline-none ring-0 focus:ring-2 focus:ring-[#1B3A57] 
                                    focus:bg-white rounded-2xl transition-all font-bold text-slate-700" type="password" placeholder="Current password" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-800 font-black ml-4">New Password</label>
                                        <input className="w-full px-6 py-4 bg-slate-100 border border-transparent 
                                        outline-none ring-0 focus:ring-2 focus:ring-[#1B3A57] 
                                        focus:bg-white rounded-2xl font-bold text-slate-700" type="password" placeholder="New Password"/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-800 font-black ml-4">Confirm New Password</label>
                                        <input className="w-full px-6 py-4 bg-slate-100 border border-transparent 
                                        outline-none ring-0 focus:ring-2 focus:ring-[#1B3A57] 
                                        focus:bg-white rounded-2xl font-bold text-slate-700" type="password" placeholder="Confirm Password"/>
                                    </div>
                                </div>
                                <button className="px-12 py-5 bg-[#1B3A57] text-white font-black rounded-2xl hover:scale-[1.02] 
                                    transition-all shadow-lg active:scale-95">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UserSettings;
