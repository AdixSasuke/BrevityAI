import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const profilePhoto = location.state?.profilePhoto || null;

    return (
        <nav className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="font-bold text-white">B</span>
                </div>
                <Link to="/" className="font-bold text-xl text-gray-900">
                    BrevityAI
                </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
                <Link
                    to="/"
                    className="text-sm font-medium text-gray-700 hover:text-purple-600"
                >
                    Home
                </Link>
                <Link
                    to="/features"
                    className="text-sm font-medium text-gray-700 hover:text-purple-600"
                >
                    Features
                </Link>
                <Link
                    to="/pricing"
                    className="text-sm font-medium text-gray-700 hover:text-purple-600"
                >
                    Pricing
                </Link>
                <Link
                    to="/contact"
                    className="text-sm font-medium text-gray-700 hover:text-purple-600"
                >
                    Contact
                </Link>
            </div>

            <div>
                {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/dashboard"
                            className="text-sm font-medium text-gray-700 hover:text-purple-600"
                        >
                            Dashboard
                        </Link>
                        <div className="relative group">
                            <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 font-medium">
                                            {user?.username
                                                ?.charAt(0)
                                                .toUpperCase() ||
                                                user?.email
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute right-0 mt-2 w-48 p-2 bg-white rounded-md shadow-lg scale-0 group-hover:scale-100 transition-transform origin-top-right">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-md"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-md"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
