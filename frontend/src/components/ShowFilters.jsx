import { useState } from "react";
import { Filter, X } from "lucide-react";

const ShowFilters = ({ onFilterChange, activeFilters }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (filterType, value) => {
        onFilterChange({
            ...activeFilters,
            [filterType]: value === activeFilters[filterType] ? "" : value
        });
    };

    const clearFilters = () => {
        onFilterChange({});
        setIsOpen(false);
    };

    const hasActiveFilters = Object.values(activeFilters).some(filter => filter);

    return (
        <div className="mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasActiveFilters 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-red-600'
                }`}
            >
                <Filter size={20} />
                Фільтри
                {hasActiveFilters && (
                    <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {Object.values(activeFilters).filter(Boolean).length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="mt-4 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Фільтри</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <X size={16} />
                                Очистити все
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Scene Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Сцена
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'main', label: 'Основна сцена' },
                                    { value: 'chamber', label: 'Камерна сцена' }
                                ].map((option) => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="sceneType"
                                            checked={activeFilters.sceneType === option.value}
                                            onChange={() => handleFilterChange('sceneType', option.value)}
                                            className="mr-3 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Genre Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Жанр
                            </label>
                            <div className="space-y-2">
                                {[
                                    'Драма', 'Комедія', 'Мюзикл', 'Трагедія', 
                                    'Історична', 'Містика', 'Епос'
                                ].map((genre) => (
                                    <label key={genre} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="genre"
                                            checked={activeFilters.genre === genre}
                                            onChange={() => handleFilterChange('genre', genre)}
                                            className="mr-3 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">{genre}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Дата від
                            </label>
                            <input
                                type="date"
                                value={activeFilters.dateFrom || ""}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowFilters;
