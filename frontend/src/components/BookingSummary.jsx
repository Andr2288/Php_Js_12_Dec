import { useBookingStore } from "../store/useBookingStore";
import { Calendar, MapPin, Clock, CreditCard, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const BookingSummary = ({ onBookingComplete }) => {
    const { 
        selectedSeats, 
        currentShow, 
        calculateTotal, 
        clearSelection, 
        submitBooking, 
        isLoading 
    } = useBookingStore();

    if (!currentShow) return null;

    const total = calculateTotal();
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sceneTypeText = currentShow.scene_type === 'main' ? 'Основна сцена' : 'Камерна сцена';

    const getSeatPrice = (row) => {
        if (row <= 3) return currentShow.price_high;
        if (row <= 7) return currentShow.price_mid;
        return currentShow.price_low;
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            toast.error("Оберіть місця для бронювання");
            return;
        }

        const result = await submitBooking();
        
        if (result.success) {
            toast.success("Бронювання успішне!");
            if (onBookingComplete) {
                onBookingComplete(result.bookingId);
            }
        } else {
            toast.error("Помилка бронювання. Спробуйте ще раз.");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Деталі бронювання</h3>
            </div>

            <div className="p-6 space-y-6">
                {/* Show Info */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-red-600 text-lg">{currentShow.title}</h4>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>{formatDate(currentShow.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin size={16} />
                            <span>{sceneTypeText}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{currentShow.period_setting}</span>
                        </div>
                    </div>
                </div>

                {/* Selected Seats */}
                {selectedSeats.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">
                                Обрані місця ({selectedSeats.length})
                            </h5>
                            <button
                                onClick={clearSelection}
                                className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                            >
                                <Trash2 size={14} />
                                <span>Очистити</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {selectedSeats.map((seat, index) => (
                                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium">
                                        Ряд {seat.row}, місце {seat.seat}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {getSeatPrice(seat.row)} грн
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🎭</div>
                        <p>Оберіть місця на схемі залу</p>
                    </div>
                )}

                {/* Total */}
                {selectedSeats.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Загальна сума:</span>
                            <span className="text-red-600">{total} грн</span>
                        </div>
                    </div>
                )}

                {/* Booking Button */}
                {selectedSeats.length > 0 && (
                    <button
                        onClick={handleBooking}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <CreditCard size={20} />
                                <span>Забронювати за {total} грн</span>
                            </>
                        )}
                    </button>
                )}

                {/* Info */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Максимум 6 місць за одне бронювання</p>
                    <p>• Бронювання дійсне протягом 15 хвилин</p>
                    <p>• Оплата на касі театру або онлайн</p>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;
