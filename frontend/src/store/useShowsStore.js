import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useShowsStore = create((set, get) => ({
    shows: [],
    isLoading: false,
    error: null,

    fetchShows: async () => {
        set({ isLoading: true, error: null });

        try {
            const res = await axiosInstance.get("/api/shows.php");

            // Parse data and convert to proper types
            const shows = res.data.map(show => ({
                ...show,
                id: parseInt(show.id),
                price_high: parseFloat(show.price_high),
                price_mid: parseFloat(show.price_mid),
                price_low: parseFloat(show.price_low)
            }));

            set({ shows, isLoading: false });
        } catch (error) {
            console.error("Error fetching shows:", error);
            set({
                error: error.response?.data?.error || "Помилка завантаження вистав",
                isLoading: false
            });
        }
    },

    getShowById: (id) => {
        const { shows } = get();
        return shows.find(show => show.id === parseInt(id));
    },

    filterShows: (filters) => {
        const { shows } = get();

        if (!filters || Object.keys(filters).length === 0) {
            return shows;
        }

        return shows.filter(show => {
            // Scene type filter
            if (filters.sceneType && show.scene_type !== filters.sceneType) {
                return false;
            }

            // Genre filter
            if (filters.genre && !show.genre.toLowerCase().includes(filters.genre.toLowerCase())) {
                return false;
            }

            // Date filter
            if (filters.dateFrom) {
                const showDate = new Date(show.date);
                const filterDate = new Date(filters.dateFrom);
                if (showDate < filterDate) return false;
            }

            return true;
        });
    }
}));