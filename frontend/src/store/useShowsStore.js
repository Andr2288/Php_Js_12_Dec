import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { mockShows } from "../data/mockShows.js";

const USE_MOCK_DATA = true; // Set to false when backend is ready

export const useShowsStore = create((set, get) => ({
    shows: [],
    isLoading: false,
    error: null,

    fetchShows: async () => {
        set({ isLoading: true, error: null });
        
        try {
            if (USE_MOCK_DATA) {
                // Use mock data for development
                setTimeout(() => {
                    set({ shows: mockShows, isLoading: false });
                }, 500); // Simulate loading delay
                return;
            }
            
            // Real API call
            const res = await axiosInstance.get("/shows");
            set({ shows: res.data, isLoading: false });
        } catch (error) {
            if (USE_MOCK_DATA) {
                // Fallback to mock data if API fails
                set({ shows: mockShows, isLoading: false });
                return;
            }
            
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
        return shows.filter(show => {
            if (filters.sceneType && show.scene_type !== filters.sceneType) {
                return false;
            }
            if (filters.genre && !show.genre.toLowerCase().includes(filters.genre.toLowerCase())) {
                return false;
            }
            if (filters.dateFrom) {
                const showDate = new Date(show.date);
                const filterDate = new Date(filters.dateFrom);
                if (showDate < filterDate) return false;
            }
            return true;
        });
    }
}));
