import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data.user});
        }
        catch (error) {
            set({authUser: null});
        }
        finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (userData) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/register", userData);
            set({authUser: res.data.user});
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Registration failed"
            };
        }
        finally {
            set({isSigningUp: false});
        }
    },

    login: async (userData) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", userData);
            set({authUser: res.data.user});
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Login failed"
            };
        }
        finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        }
        catch (error) {
            console.log("Logout error:", error);
        }
        finally {
            set({authUser: null});
        }
    }
}));