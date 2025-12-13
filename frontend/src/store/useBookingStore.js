import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useBookingStore = create((set, get) => ({
    selectedSeats: [],
    bookedSeats: [],
    isLoading: false,
    error: null,
    currentShow: null,

    // Set current show
    setCurrentShow: (show) => {
        set({ 
            currentShow: show,
            selectedSeats: [],
            error: null 
        });
    },

    // Fetch already booked seats for a show
    fetchBookedSeats: async (showId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/bookings/show/${showId}`);
            set({ 
                bookedSeats: res.data.bookedSeats || [],
                isLoading: false 
            });
        } catch (error) {
            // Mock data for development
            const mockBookedSeats = [
                { row: 1, seat: 5 }, { row: 1, seat: 6 },
                { row: 3, seat: 10 }, { row: 3, seat: 11 },
                { row: 5, seat: 15 }, { row: 7, seat: 8 }
            ];
            set({ 
                bookedSeats: mockBookedSeats,
                isLoading: false 
            });
        }
    },

    // Toggle seat selection
    toggleSeat: (row, seat) => {
        const { selectedSeats, bookedSeats } = get();
        
        // Check if seat is already booked
        const isBooked = bookedSeats.some(bookedSeat => 
            bookedSeat.row === row && bookedSeat.seat === seat
        );
        
        if (isBooked) return;
        
        // Check if seat is already selected
        const seatIndex = selectedSeats.findIndex(selectedSeat =>
            selectedSeat.row === row && selectedSeat.seat === seat
        );
        
        if (seatIndex >= 0) {
            // Remove seat from selection
            set({
                selectedSeats: selectedSeats.filter((_, index) => index !== seatIndex)
            });
        } else {
            // Add seat to selection (limit to 6 seats)
            if (selectedSeats.length < 6) {
                set({
                    selectedSeats: [...selectedSeats, { row, seat }]
                });
            }
        }
    },

    // Clear all selected seats
    clearSelection: () => {
        set({ selectedSeats: [] });
    },

    // Calculate total price
    calculateTotal: () => {
        const { selectedSeats, currentShow } = get();
        if (!currentShow || selectedSeats.length === 0) return 0;
        
        let total = 0;
        selectedSeats.forEach(seat => {
            // Price based on row (simplified pricing logic)
            if (seat.row <= 3) {
                total += currentShow.price_high;
            } else if (seat.row <= 7) {
                total += currentShow.price_mid;
            } else {
                total += currentShow.price_low;
            }
        });
        return total;
    },

    // Submit booking
    submitBooking: async () => {
        const { selectedSeats, currentShow } = get();
        
        if (!selectedSeats.length || !currentShow) {
            set({ error: "Оберіть місця для бронювання" });
            return { success: false };
        }

        set({ isLoading: true, error: null });
        
        try {
            const bookingData = {
                showId: currentShow.id,
                seats: selectedSeats,
                totalPrice: get().calculateTotal()
            };
            
            const res = await axiosInstance.post("/bookings", bookingData);
            
            set({ 
                selectedSeats: [],
                bookedSeats: [...get().bookedSeats, ...selectedSeats],
                isLoading: false 
            });
            
            return { 
                success: true, 
                bookingId: res.data.bookingId 
            };
            
        } catch (error) {
            set({ 
                error: error.response?.data?.error || "Помилка бронювання",
                isLoading: false 
            });
            return { success: false };
        }
    }
}));
