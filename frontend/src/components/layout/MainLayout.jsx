import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="py-6 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-500">
                        <p>
                            &copy; {new Date().getFullYear()} BrevityAI. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
