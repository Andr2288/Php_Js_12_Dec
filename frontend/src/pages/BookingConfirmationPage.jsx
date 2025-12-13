import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Calendar, MapPin, CreditCard, Home } from "lucide-react";

const BookingConfirmationPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        // In a real app, fetch booking details by ID
        // For now, use mock data
        if (bookingId) {
            setBooking({
                id: bookingId,
                show: {
                    title: "Чикаго",
                    date: "2024-12-25T19:00:00",
                    scene_type: "main",
                    poster: "/images/chicago.jpg"
                },
                seats: [
                    { row: 5, seat: 10 },
                    { row: 5, seat: 11 }
                ],
                total: 900,
                bookingDate: new Date(),
                status: "confirmed"
            });
        } else {
            navigate("/");
        }
    }, [bookingId, navigate]);

    if (!booking) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">🎭</div>
                    <p className="text-gray-600">Завантаження...</p>
                </div>
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

    const sceneTypeText = booking.show.scene_type === 'main' ? 'Основна сцена' : 'Камерна сцена';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <CheckCircle size={80} className="text-green-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Бронювання підтверджено!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Ваші квитки заброньовані. Деталі бронювання нижче.
                    </p>
                </div>

                {/* Booking Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                        <h2 className="text-lg font-semibold text-red-800">
                            Бронювання #{booking.id}
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Show Info */}
                        <div className="flex items-start space-x-4">
                            {booking.show.poster && (
                                <img 
                                    src={booking.show.poster} 
                                    alt={booking.show.title}
                                    className="w-16 h-24 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-red-600 mb-2">
                                    {booking.show.title}
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={16} />
                                        <span>{formatDate(booking.show.date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} />
                                        <span>{sceneTypeText}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seats */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Ваші місця:</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {booking.seats.map((seat, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                                        <span className="font-medium text-gray-900">
                                            Ряд {seat.row}, місце {seat.seat}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium text-gray-900">Загальна сума:</span>
                                <span className="text-2xl font-bold text-red-600">{booking.total} грн</span>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <CreditCard size={16} className="text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                            Оплата в касі театру
                                        </p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Прийдіть за 30 хвилин до початку вистави для оплати та отримання квитків.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>Дата бронювання: {booking.bookingDate.toLocaleString('uk-UA')}</p>
                            <p>Статус: Підтверджено</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/profile"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors text-center"
                    >
                        Мої бронювання
                    </Link>
                    
                    <Link 
                        to="/"
                        className="flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <Home size={20} />
                        <span>На головну</span>
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Важлива інформація:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Прийдіть за 30 хвилин до початку для оплати квитків</li>
                        <li>• При собі мати документ, що посвідчує особу</li>
                        <li>• Бронювання діє протягом 24 годин</li>
                        <li>• Повернення коштів можливе за 48 годин до вистави</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmationPage;
