import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success("До зустрічі!");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-black text-white z-50 shadow-lg">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl font-bold text-red-500 hover:text-red-400 transition-colors"
                    >
                        RESONANCE
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="hover:text-red-400 transition-colors"
                        >
                            Репертуар
                        </Link>
                        <Link
                            to="/about"
                            className="hover:text-red-400 transition-colors"
                        >
                            Про театр
                        </Link>
                        <Link
                            to="/contacts"
                            className="hover:text-red-400 transition-colors"
                        >
                            Контакти
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {authUser ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                                >
                                    <User size={18} />
                                    <span className="hidden sm:block">{authUser.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:block">Вийти</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="hover:text-red-400 transition-colors"
                                >
                                    Вхід
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Реєстрація
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;