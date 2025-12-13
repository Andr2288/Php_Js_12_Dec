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

            if (res.data.authenticated) {
                set({authUser: res.data.user});
            } else {
                set({authUser: null});
            }
        }
        catch (error) {
            console.error("Check auth error:", error);
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

            if (res.data.success && res.data.user) {
                set({authUser: res.data.user});
                return { success: true };
            }

            return {
                success: false,
                error: "Помилка реєстрації"
            };
        }
        catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: error.response?.data?.error || "Помилка реєстрації"
            };
        }
        finally {
            set({isSigningUp: false});
        }
    },

    login: async (userData) => {
        set({isLoggingIn: true});
        try {
            console.log("Login attempt with:", userData.email);
            const res = await axiosInstance.post("/auth/login", userData);

            console.log("Login response:", res.data);

            if (res.data.success && res.data.user) {
                console.log("Setting authUser:", res.data.user);
                set({authUser: res.data.user});
                return { success: true };
            }

            return {
                success: false,
                error: "Помилка входу"
            };
        }
        catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: error.response?.data?.error || "Невірний email або пароль"
            };
        }
        finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
        }
        catch (error) {
            console.error("Logout error:", error);
            // Навіть якщо запит не вдався, очищаємо стан
            set({authUser: null});
        }
    }
}));