import { Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const ShowCard = ({ show }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sceneTypeText = show.scene_type === 'main' ? 'Основна сцена' : 'Камерна сцена';

    // Функція для запису взаємодії
    const trackInteraction = async (interactionType) => {
        try {
            await axiosInstance.post('/api/shows.php', {
                show_id: show.id,
                interaction_type: interactionType
            });
        } catch (error) {
            // Тихо ігноруємо помилки відстеження
            console.debug('Interaction tracking error:', error);
        }
    };

    const handleBookingClick = () => {
        trackInteraction('attempt_book');
    };

    const handleDetailsClick = () => {
        trackInteraction('view');
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
            {/* Poster Image */}
            <div className="relative h-80 bg-gray-200 overflow-hidden">
                {show.poster ? (
                    <img
                        src={show.poster}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-4xl text-gray-400">🎭</span>
                    </div>
                )}

                {/* Genre badge */}
                <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                    {show.genre}
                </div>
            </div>

            {/* Show Info */}
            <div className="p-6">
                {/* Date and Time */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(show.date)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-red-600 mb-3 group-hover:text-red-700 transition-colors">
                    {show.title}
                </h3>

                {/* Scene and Period */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {sceneTypeText}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        {show.period_setting}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Ціна квитків:</p>
                    <p className="font-semibold text-lg">
                        {show.price_low} - {show.price_high} грн
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        to={`/booking/${show.id}`}
                        onClick={handleBookingClick}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                        Купити квиток
                    </Link>
                    <Link
                        to={`/show/${show.id}`}
                        onClick={handleDetailsClick}
                        className="border border-gray-300 hover:border-red-600 hover:text-red-600 text-gray-700 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                        Детальніше
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShowCard;