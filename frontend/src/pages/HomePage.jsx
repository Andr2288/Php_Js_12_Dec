import { useEffect, useState } from "react";
import { useShowsStore } from "../store/useShowsStore";
import { useAuthStore } from "../store/useAuthStore";
import ShowCard from "../components/ShowCard";
import ShowFilters from "../components/ShowFilters";
import { Loader, Calendar } from "lucide-react";

const HomePage = () => {
    const { shows, fetchShows, isLoading, error, filterShows } = useShowsStore();
    const { authUser } = useAuthStore();
    const [filters, setFilters] = useState({});
    const [filteredShows, setFilteredShows] = useState([]);

    useEffect(() => {
        fetchShows();
    }, [fetchShows]);

    useEffect(() => {
        if (shows.length > 0) {
            const filtered = filterShows(filters);
            setFilteredShows(filtered);
        }
    }, [shows, filters, filterShows]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-red-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="text-center">
                        <p className="text-red-600 text-lg mb-4">Помилка: {error}</p>
                        <button
                            onClick={fetchShows}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Спробувати ще раз
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Театр <span className="text-red-500">RESONANCE</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Відкрийте для себе світ високого мистецтва. Оберіть виставу та насолоджуйтесь незабутніми вечорами в театрі.
                    </p>
                    {authUser && (
                        <p className="text-lg text-gray-400">
                            Вітаємо, <span className="text-red-400 font-medium">{authUser.name}</span>!
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Афіша</h2>
                        <p className="text-gray-600 flex items-center gap-2">
                            <Calendar size={18} />
                            {filteredShows.length} {filteredShows.length === 1 ? 'вистава' : 'вистав'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <ShowFilters
                    onFilterChange={handleFilterChange}
                    activeFilters={filters}
                />

                {/* Shows Grid */}
                {filteredShows.length > 0 ? (
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
                        {filteredShows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            Вистав не знайдено
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Спробуйте змінити фільтри або перегляньте всі вистави
                        </p>
                        <button
                            onClick={() => setFilters({})}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Показати всі вистави
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;