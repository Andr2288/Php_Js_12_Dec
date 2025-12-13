import { Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";

const ShowCard = ({ show }) => {
    const [imageError, setImageError] = useState(false);

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

    const handleImageError = () => {
        setImageError(true);
    };

    // Красивий плейсхолдер на основі жанру
    const getPlaceholderGradient = (genre) => {
        const gradients = {
            'Драма': 'from-purple-600 to-purple-800',
            'Комедія': 'from-yellow-500 to-orange-600',
            'Мюзикл': 'from-pink-500 to-red-600',
            'Трагедія': 'from-gray-700 to-gray-900',
            'Історична': 'from-amber-600 to-amber-800',
            'Містика': 'from-indigo-600 to-purple-700',
            'Епос': 'from-emerald-600 to-teal-700'
        };
        return gradients[genre] || 'from-red-500 to-red-700';
    };

    const getGenreEmoji = (genre) => {
        const emojis = {
            'Драма': '🎭',
            'Комедія': '😄',
            'Мюзикл': '🎵',
            'Трагедія': '💔',
            'Історична': '🏛️',
            'Містика': '🔮',
            'Епос': '⚔️'
        };
        return emojis[genre] || '🎭';
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
            {/* Poster Image */}
            <div className="relative h-80 bg-gray-200 overflow-hidden">
                {show.poster && !imageError ? (
                    <img
                        src={show.poster}
                        alt={show.title}
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient(show.genre)} flex items-center justify-center relative overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="w-full h-full" style={{
                                backgroundImage: `repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 10px,
                                    rgba(255,255,255,0.1) 10px,
                                    rgba(255,255,255,0.1) 20px
                                )`
                            }}></div>
                        </div>

                        {/* Content */}
                        <div className="text-center text-white z-10">
                            <div className="text-6xl mb-4 animate-pulse">
                                {getGenreEmoji(show.genre)}
                            </div>
                            <div className="text-lg font-semibold mb-2 px-4">
                                {show.title}
                            </div>
                            <div className="text-sm opacity-90 uppercase tracking-wider">
                                {show.genre}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/20 rounded-full"></div>
                    </div>
                )}

                {/* Genre badge - тільки якщо є фото */}
                {show.poster && !imageError && (
                    <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                        {show.genre}
                    </div>
                )}
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