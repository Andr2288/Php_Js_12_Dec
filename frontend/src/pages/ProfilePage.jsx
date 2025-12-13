import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { User, Mail, Calendar, Ticket, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
    const { authUser } = useAuthStore();
    const [bookings, setBookings] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authUser) {
            fetchUserData();
        }
    }, [authUser]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const [bookingsRes, recommendationsRes] = await Promise.all([
                axiosInstance.get('/api/user-bookings.php'),
                axiosInstance.get('/api/recommendations.php')
            ]);

            setBookings(bookingsRes.data.bookings || []);
            setRecommendations(recommendationsRes.data.recommendations || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!authUser) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Мій профіль</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* User Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <User size={32} className="text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        {authUser.name}
                                    </h2>
                                    <p className="text-gray-600">{authUser.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <User size={20} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ім'я</p>
                                        <p className="font-medium">{authUser.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail size={20} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{authUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar size={20} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Користувач з</p>
                                        <p className="font-medium">
                                            {new Date(authUser.created_at || Date.now()).toLocaleDateString('uk-UA')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                                    <Ticket size={20} className="text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Всього бронювань</p>
                                        <p className="font-medium text-red-600">{bookings.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bookings & Recommendations */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Booking History */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Ticket className="mr-3 text-red-600" />
                                Історія бронювань
                            </h3>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500">Завантаження...</p>
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-red-600">{booking.show_title}</h4>
                                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                                        <Calendar size={14} className="mr-1" />
                                                        {formatDate(booking.show_date)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{booking.genre} • {booking.scene_type === 'main' ? 'Основна сцена' : 'Камерна сцена'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">{booking.total_price} грн</p>
                                                    <p className="text-sm text-gray-500">{booking.seats_count} місць</p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Місця: {booking.seats}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Ticket size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>У вас поки немає бронювань</p>
                                </div>
                            )}
                        </div>

                        {/* Recommendations */}
                        {!isLoading && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Star className="mr-3 text-yellow-500" />
                                    Рекомендуємо переглянути
                                </h3>

                                {recommendations.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {recommendations.map((show) => (
                                            <div key={show.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-red-600 mb-1">{show.title}</h4>
                                                        <p className="text-sm text-gray-600 flex items-center">
                                                            <Clock size={14} className="mr-1" />
                                                            {formatDate(show.date)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{show.genre} • {show.period_setting}</p>
                                                    </div>
                                                    {show.poster && (
                                                        <img
                                                            src={show.poster}
                                                            alt={show.title}
                                                            className="w-12 h-16 object-cover rounded ml-3"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        від {show.price_low} грн
                                                    </span>
                                                    <Link
                                                        to={`/booking/${show.id}`}
                                                        className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Бронювати
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Star size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="mb-2">Поки немає персональних рекомендацій</p>
                                        <p className="text-sm">Заброньуйте кілька вистав, щоб ми могли запропонувати вам щось цікаве!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;