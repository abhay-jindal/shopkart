import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth, useCart } from "../context";
import { useState, useRef } from "react";

const Header = ({ centerNavigation, showKart=true }) => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 200); // Delay of 200ms
    };

    return (
        <header className="bg-white shadow-sm w-full px-8 py-3 flex items-center justify-between relative z-50">
            {/* Logo */}
            <Link to="/" className="text-l italic font-bold tracking-tight text-black">Shopkart</Link>

            {centerNavigation()}

            {/* Right Controls */}
            <div className="flex items-center gap-10 relative">
                {/* Cart */}
                {showKart && <Link to="/checkout/cart" className="relative text-gray-700 hover:text-black">
                    <ShoppingCart />
                    {cartItems?.length > 0 && (
                        <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1">
                            {cartItems.length}
                        </span>
                    )}
                </Link>}

                {/* Account */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="text-gray-700 hover:text-black">
                        <User />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md text-sm w-40 z-[9999] border border-gray-200">
                            {!user ? (
                                <>
                                    <Link to="/login" className="block px-4 py-2 hover:bg-neutral-100">Sign In</Link>
                                    <Link to="/register" className="block px-4 py-2 hover:bg-neutral-100">Register</Link>
                                </>
                            ) : (
                                <>
                                    <span className="block px-4 py-2 text-gray-500">{user.name}</span>
                                    <Link to="/addresses" className="block px-4 py-2 hover:bg-neutral-100">Addresses</Link>
                                    <Link to="/order/history" className="block px-4 py-2 hover:bg-neutral-100">Orders</Link>
                                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-neutral-100">Sign Out</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
