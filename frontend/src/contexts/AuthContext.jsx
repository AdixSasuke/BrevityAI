import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

// Create the auth context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from local storage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error("Error initializing authentication:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        setError(null);
        setLoading(true);
        try {
            const user = await authService.login(credentials);
            setUser(user);
            return user;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Login failed. Please check your credentials."
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setError(null);
        setLoading(true);
        try {
            const user = await authService.register(userData);
            setUser(user);
            return user;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again."
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Auth context value
    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
