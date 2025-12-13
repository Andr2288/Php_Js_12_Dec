import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useShowsStore } from "../store/useShowsStore";
import { useBookingStore } from "../store/useBookingStore";
import SeatGrid from "../components/SeatGrid";
import BookingSummary from "../components/BookingSummary";
import { ArrowLeft, Loader } from "lucide-react";

const BookingPage = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const { getShowById } = useShowsStore();
    const { setCurrentShow, fetchBookedSeats, isLoading } = useBookingStore();
    const [show, setShow] = useState(null);

    useEffect(() => {
        if (showId) {
            const foundShow = getShowById(showId);
            if (foundShow) {
                setShow(foundShow);
                setCurrentShow(foundShow);
                fetchBookedSeats(showId);
            } else {
                navigate("/");
            }
        }
    }, [showId, getShowById, setCurrentShow, fetchBookedSeats, navigate]);

    const handleBookingComplete = (bookingId) => {
        navigate(`/booking-confirmation/${bookingId}`);
    };

    if (!show) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-red-600" />
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/"
                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Назад до афіші</span>
                        </Link>
                    </div>
                </div>

                {/* Show Info Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-red-600 mb-2">{show.title}</h1>
                            <p className="text-lg text-gray-700 mb-1">{formatDate(show.date)}</p>
                            <p className="text-gray-600">
                                {show.scene_type === 'main' ? 'Основна сцена' : 'Камерна сцена'} • {show.genre} • {show.period_setting}
                            </p>
                        </div>
                        
                        {show.poster && (
                            <img 
                                src={show.poster} 
                                alt={show.title}
                                className="w-20 h-28 object-cover rounded-lg"
                            />
                        )}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Ціни на квитки:</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <span className="block text-red-600 font-semibold">{show.price_high} грн</span>
                                <span className="text-gray-600">Ряди 1-3</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-yellow-600 font-semibold">{show.price_mid} грн</span>
                                <span className="text-gray-600">Ряди 4-7</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-green-600 font-semibold">{show.price_low} грн</span>
                                <span className="text-gray-600">Ряди 8+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Seat Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                                Оберіть місця в залі
                            </h2>
                            
                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader className="w-8 h-8 animate-spin text-red-600" />
                                </div>
                            ) : (
                                <SeatGrid sceneType={show.scene_type} />
                            )}
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <BookingSummary onBookingComplete={handleBookingComplete} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
