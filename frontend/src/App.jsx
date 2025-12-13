import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import ShowDetailPage from "./pages/ShowDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";

import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center">
                    <Loader className="size-10 animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Завантаження...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/profile"
                    element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/show/:showId"
                    element={authUser ? <ShowDetailPage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/booking/:showId"
                    element={authUser ? <BookingPage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/booking-confirmation/:bookingId"
                    element={authUser ? <BookingConfirmationPage /> : <Navigate to="/login" replace />}
                />

                {/* Public pages - доступні всім без авторизації */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contacts" element={<ContactsPage />} />

                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} replace />} />
            </Routes>

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </>
    );
};

export default App;