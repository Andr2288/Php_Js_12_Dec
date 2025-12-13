import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://theater-booking.local/backend",
    withCredentials: true, // ВАЖЛИВО для сесій
    headers: {
        'Content-Type': 'application/json'
    }
});