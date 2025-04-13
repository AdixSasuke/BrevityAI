import api from "./api";
import { jwtDecode } from "jwt-decode";

const authService = {
    login: async (credentials) => {
        const response = await api.post("/api/auth/login", credentials);
        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
            return jwtDecode(response.data.access_token);
        }
        return null;
    },

    register: async (userData) => {
        const response = await api.post("/api/auth/register", userData);
        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
            return jwtDecode(response.data.access_token);
        }
        return null;
    },

    logout: () => {
        localStorage.removeItem("token");
    },

    getCurrentUser: () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    localStorage.removeItem("token");
                    return null;
                }
                return decoded;
            } catch (error) {
                localStorage.removeItem("token");
                return null;
            }
        }
        return null;
    },

    refreshToken: async () => {
        const response = await api.post("/api/auth/refresh");
        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
            return jwtDecode(response.data.access_token);
        }
        return null;
    },

    isAuthenticated: () => {
        return localStorage.getItem("token") !== null;
    },
};

export default authService;
