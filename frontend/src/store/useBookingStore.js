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
            const res = await axiosInstance.get(`/api/bookings.php?show_id=${showId}`);
            set({
                bookedSeats: res.data.bookedSeats || [],
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching booked seats:", error);
            set({
                error: error.response?.data?.error || "Помилка завантаження бронювань",
                bookedSeats: [],
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
            } else {
                set({ error: "Максимум 6 місць за одне бронювання" });
            }
        }
    },

    // Clear all selected seats
    clearSelection: () => {
        set({ selectedSeats: [], error: null });
    },

    // Calculate total price
    calculateTotal: () => {
        const { selectedSeats, currentShow } = get();
        if (!currentShow || selectedSeats.length === 0) return 0;

        let total = 0;
        selectedSeats.forEach(seat => {
            if (currentShow.scene_type === "chamber") {
                // Камерна сцена: 1 ряд - висока, 2-3 ряди - середня, 4 ряд - низька
                if (seat.row === 1) {
                    total += parseFloat(currentShow.price_high);
                } else if (seat.row <= 3) {
                    total += parseFloat(currentShow.price_mid);
                } else {
                    total += parseFloat(currentShow.price_low);
                }
            } else {
                // Основна сцена: 1-3 ряди - висока, 4-7 ряди - середня, 8+ ряди - низька
                if (seat.row <= 3) {
                    total += parseFloat(currentShow.price_high);
                } else if (seat.row <= 7) {
                    total += parseFloat(currentShow.price_mid);
                } else {
                    total += parseFloat(currentShow.price_low);
                }
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

            const res = await axiosInstance.post("/api/bookings.php", bookingData);

            // Add newly booked seats to bookedSeats
            set({
                selectedSeats: [],
                bookedSeats: [...get().bookedSeats, ...selectedSeats],
                isLoading: false,
                error: null
            });

            return {
                success: true,
                bookingId: res.data.bookingId
            };

        } catch (error) {
            console.error("Booking error:", error);
            const errorMessage = error.response?.data?.error || "Помилка бронювання";
            set({
                error: errorMessage,
                isLoading: false
            });
            return { success: false, error: errorMessage };
        }
    }
}));