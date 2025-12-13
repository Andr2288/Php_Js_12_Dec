import { useBookingStore } from "../store/useBookingStore";

const SeatGrid = ({ sceneType = "main" }) => {
    const { selectedSeats, bookedSeats, toggleSeat } = useBookingStore();

    // Configuration based on scene type
    const config = sceneType === "main"
        ? { totalRows: 10, seatsPerRow: 20, gapAfter: 10 }
        : { totalRows: 4, seatsPerRow: 10, gapAfter: 5 };

    const { totalRows, seatsPerRow, gapAfter } = config;

    const getSeatStatus = (row, seat) => {
        const isBooked = bookedSeats.some(bookedSeat =>
            bookedSeat.row === row && bookedSeat.seat === seat
        );
        const isSelected = selectedSeats.some(selectedSeat =>
            selectedSeat.row === row && selectedSeat.seat === seat
        );

        if (isBooked) return "booked";
        if (isSelected) return "selected";
        return "available";
    };

    const getSeatPrice = (row) => {
        if (sceneType === "chamber") {
            // Камерна сцена: 1 ряд - висока, 2-3 ряди - середня, 4 ряд - низька
            if (row === 1) return "high";
            if (row <= 3) return "mid";
            return "low";
        } else {
            // Основна сцена: 1-3 ряди - висока, 4-7 ряди - середня, 8+ ряди - низька
            if (row <= 3) return "high";
            if (row <= 7) return "mid";
            return "low";
        }
    };

    const handleSeatClick = (row, seat) => {
        toggleSeat(row, seat);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Stage */}
            <div className="bg-gray-600 text-white px-12 py-3 rounded-lg text-lg font-medium">
                Сцена
            </div>

            {/* Seat Grid */}
            <div className="relative">
                {/* Row Numbers */}
                <div className="absolute -left-16 top-0 flex flex-col-reverse space-y-reverse space-y-1.5">
                    {Array.from({ length: totalRows }, (_, i) => totalRows - i).map(rowNum => (
                        <div key={rowNum} className="h-8 flex items-center justify-end text-sm font-medium text-gray-600">
                            Ряд {rowNum}
                        </div>
                    ))}
                </div>

                {/* Seats */}
                <div className="flex flex-col-reverse space-y-reverse space-y-1.5">
                    {Array.from({ length: totalRows }, (_, i) => totalRows - i).map(rowNum => (
                        <div key={rowNum} className="flex items-center justify-center space-x-1.5">
                            {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map(seatNum => {
                                const status = getSeatStatus(rowNum, seatNum);
                                const priceCategory = getSeatPrice(rowNum);

                                return (
                                    <div key={seatNum} className="flex items-center">
                                        {/* Add gap after certain seat */}
                                        {seatNum === gapAfter + 1 && (
                                            <div className="w-8" />
                                        )}

                                        <button
                                            onClick={() => handleSeatClick(rowNum, seatNum)}
                                            disabled={status === "booked"}
                                            className={`
                                                w-8 h-8 text-xs font-medium rounded-full transition-all duration-200
                                                ${status === "available" && priceCategory === "high" ? "bg-red-100 text-red-800 border-2 border-red-200 hover:bg-red-200" : ""}
                                                ${status === "available" && priceCategory === "mid" ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200 hover:bg-yellow-200" : ""}
                                                ${status === "available" && priceCategory === "low" ? "bg-green-100 text-green-800 border-2 border-green-200 hover:bg-green-200" : ""}
                                                ${status === "selected" ? "bg-red-600 text-white border-2 border-red-700 scale-110" : ""}
                                                ${status === "booked" ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60" : ""}
                                                ${status === "available" ? "hover:scale-105 cursor-pointer" : ""}
                                            `}
                                        >
                                            {seatNum}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Horizontal gap for main scene */}
                {sceneType === "main" && (
                    <div className="absolute left-1/2 -translate-x-1/2"
                         style={{ top: `${(6 * 36)}px` }}>
                        <div className="h-6 w-full" />
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded-full"></div>
                    <span>
                        Високі ціни {sceneType === "chamber" ? "(ряд 1)" : "(ряди 1-3)"}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-200 rounded-full"></div>
                    <span>
                        Середні ціни {sceneType === "chamber" ? "(ряди 2-3)" : "(ряди 4-7)"}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-200 rounded-full"></div>
                    <span>
                        Низькі ціни {sceneType === "chamber" ? "(ряд 4)" : "(ряди 8+)"}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                    <span>Обрано</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    <span>Заброньовано</span>
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;