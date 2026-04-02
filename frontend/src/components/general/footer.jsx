function Footer() {
    return (
        <footer className="w-full mt-24 py-10 border-t border-gray-300 bg-[#2F6FA3]">
            <div className="flex flex-col items-center justify-center text-center gap-3">
                <p className="text-sm text-gray-300 tracking-wide">
                    © <span className="text-yellow-400">
                        Geraldine Jewelry
                        </span> 
                    — All Rights Reserved 💍
                </p>

                <div className="flex gap-6">
                    {/* Social icons go here for the future */}
                </div>
            </div>
        </footer>
    );
}

export default Footer;