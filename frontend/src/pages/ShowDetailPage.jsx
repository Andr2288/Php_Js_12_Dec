import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Calendar, MapPin, Clock, ArrowLeft, Ticket, Star } from "lucide-react";

const ShowDetailPage = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (showId) {
            fetchShowDetails();
        }
    }, [showId]);

    const fetchShowDetails = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get(`/api/shows.php?show_id=${showId}`);
            setShow(res.data);
        } catch (error) {
            console.error('Error fetching show details:', error);
            setError('Виставу не знайдено');
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleBooking = async () => {
        try {
            await axiosInstance.post('/api/shows.php', {
                show_id: showId,
                interaction_type: 'attempt_book'
            });
            navigate(`/booking/${showId}`);
        } catch (error) {
            console.debug('Interaction tracking error:', error);
            navigate(`/booking/${showId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Завантаження...</p>
                </div>
            </div>
        );
    }

    if (error || !show) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">🎭</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Виставу не знайдено</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/"
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Повернутися до афіші
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const sceneTypeText = show.scene_type === 'main' ? 'Основна сцена' : 'Камерна сцена';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Назад до афіші</span>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Poster */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {show.poster ? (
                                <img
                                    src={show.poster}
                                    alt={show.title}
                                    className="w-full h-96 object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                                    <span className="text-6xl text-gray-400">🎭</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                                        {show.genre}
                                    </span>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        {show.period_setting}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-red-600 mb-4">
                                    {show.title}
                                </h1>
                            </div>

                            {/* Show Details */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3">
                                    <Calendar size={20} className="text-gray-500" />
                                    <span className="text-lg">{formatDate(show.date)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <MapPin size={20} className="text-gray-500" />
                                    <span className="text-lg">{sceneTypeText}</span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <Clock size={20} className="text-gray-500" />
                                    <span className="text-lg">{show.period_setting}</span>
                                </div>
                            </div>

                            {/* Description */}
                            {show.description && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Опис</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {show.description}
                                    </p>
                                </div>
                            )}

                            {/* Pricing */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ціни на квитки</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-red-600 mb-1">
                                            {show.price_high} грн
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {show.scene_type === 'chamber' ? 'Ряд 1' : 'Ряди 1-3'}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                                            {show.price_mid} грн
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {show.scene_type === 'chamber' ? 'Ряди 2-3' : 'Ряди 4-7'}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600 mb-1">
                                            {show.price_low} грн
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {show.scene_type === 'chamber' ? 'Ряд 4' : 'Ряди 8+'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleBooking}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3"
                                >
                                    <Ticket size={24} />
                                    <span>Забронювати квитки</span>
                                </button>
                                
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                    <Star size={20} />
                                    <span>В закладки</span>
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-8 bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Важлива інформація:</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• Прийдіть за 30 хвилин до початку вистави</li>
                                    <li>• При собі мати документ, що посвідчує особу</li>
                                    <li>• Заборонено проносити їжу та напої</li>
                                    <li>• Вистава може містити стробоскопічні ефекти</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowDetailPage;
